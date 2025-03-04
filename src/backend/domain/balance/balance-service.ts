import { BalanceType } from 'src/backend/database/balance/balance-entity';
import BalanceRepository from 'src/backend/database/balance/balance-repository';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { UsageRepository } from 'src/backend/database/usages/repository';
import { UseLogger } from 'src/backend/integration/logger/decorator';
import { v4 } from 'uuid';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import { NotFoundError, UnprocessableEntityError } from 'src/utils/error/http-error';
import awaitToError from 'src/utils/await-to-error';
import { CreditService } from '../credit/credit-service';
import { EXPORT_CREDIT_TRIAL_TOTAL } from 'src/constants/credits';
import type { CompanyEntity } from 'src/backend/database/company/company-entity';
export default class BalanceService {
    static service = new BalanceService();
    static getService = () => BalanceService.service;
    @UseLogger()
    async initBalance(param?: { companyId: string; force?: boolean }) {
        let companyId = param?.companyId;
        const force = param?.force ?? false;
        if (!companyId) {
            companyId = RequestContext.getContext().companyId as string;
        }
        const balance = await BalanceRepository.getRepository().find({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (balance.length > 0 && !force) return;
        const company = await CompanyRepository.getRepository().findOne({
            where: {
                id: companyId,
            },
            relations: ['subscription'],
        });
        if (!company) return;
        const usages = await this.getCompanyUsage(company);
        await awaitToError(
            BalanceRepository.getRepository().upsert(
                [
                    {
                        id: v4(),
                        company: {
                            id: companyId,
                        },
                        type: BalanceType.PROFILE,
                        amount: usages.profile,
                    },
                    {
                        id: v4(),
                        company: {
                            id: companyId,
                        },
                        type: BalanceType.SEARCH,
                        amount: usages.search,
                    },
                    {
                        id: v4(),
                        company: {
                            id: companyId,
                        },
                        type: BalanceType.EXPORT,
                        amount: usages.export,
                    },
                ],
                {
                    conflictPaths: ['company', 'type'],
                },
            ),
        );
    }
    @UseLogger()
    @CompanyIdRequired()
    async deductBalanceInProcess(type: BalanceType, amount = 1) {
        const companyId = RequestContext.getContext().companyId as string;
        await BalanceRepository.getRepository().deduct(companyId, type, amount);
    }
    @UseLogger()
    @CompanyIdRequired()
    async refundBalanceInProcess(type: BalanceType, amount = 1) {
        const companyId = RequestContext.getContext().companyId as string;
        // refund balance by deduct with -amount
        await BalanceRepository.getRepository().deduct(companyId, type, -amount);
    }

    @UseLogger()
    async checkBalance(type: BalanceType, cost: number, companyId?: string) {
        if (!companyId) {
            companyId = RequestContext.getContext().companyId as string;
        }
        if (!companyId) {
            throw new Error('company id is required');
        }
        const [err, balance] = await awaitToError(
            BalanceRepository.getRepository().findOneByOrFail({
                company: {
                    id: companyId,
                },
                type,
            }),
        );

        if (err) {
            throw new NotFoundError('balance not found');
        }

        if (balance.amount - cost < 0) throw new UnprocessableEntityError('insufficientBalance');
    }

    @UseLogger()
    @CompanyIdRequired()
    async getAllBalance() {
        const companyId = RequestContext.getContext().companyId as string;
        const balances = await BalanceRepository.getRepository().find({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        const company = await CompanyRepository.getRepository().findOne({
            where: {
                id: companyId,
            },
        });
        if (!company) return;
        const usages = await this.getCompanyUsage(company);
        const existedTypes = balances.map((balance) => balance.type);
        const nonExistedTypes = Object.values(BalanceType).filter((type) => !existedTypes.includes(type));
        const newBalances = nonExistedTypes.map((type) => ({
            id: v4(),
            company: {
                id: companyId,
            },
            type,
            amount: usages[type],
        }));
        if (newBalances.length > 0) {
            await BalanceRepository.getRepository().upsert(newBalances, {
                conflictPaths: ['company', 'type'],
            });
            return [
                ...balances,
                ...newBalances.map((balance) => ({ ...balance, amount: balance.amount + '', company: undefined })),
            ];
        }
        return balances;
    }

    @UseLogger()
    @CompanyIdRequired()
    getBalance(type: BalanceType) {
        const companyId = RequestContext.getContext().companyId as string;
        return BalanceRepository.getRepository().findOneOrFail({
            where: {
                company: {
                    id: companyId,
                },
                type,
            },
        });
    }

    @UseLogger()
    async scheduleAll() {
        await BalanceRepository.getRepository().resetBySchedule();
    }

    @UseLogger()
    async refundUsageInProcess({
        companyId,
        userId,
        creatorId,
        usageType,
    }: {
        companyId: string;
        userId: string;
        creatorId: string;
        usageType: BalanceType;
    }) {
        const usage = await UsageRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
                profile: {
                    id: userId,
                },
                itemId: creatorId,
                type: usageType,
            },
        });
        await UsageRepository.getRepository().delete({
            id: usage?.id,
        });
    }

    private async getCompanyUsage(company: CompanyEntity) {
        const startDate = new Date(company.subscription?.activeAt || company.createdAt);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

        const usage = await UsageRepository.getRepository().getCountUsages(company.id, startDate, endDate);
        const credit = await CreditService.getService().getTotalCredit();
        const searchLimit = parseInt(
            ['trial', 'trialing'].includes(company.subscriptionStatus)
                ? company.trialSearchesLimit
                : credit.search + '',
        );
        const profileLimit = parseInt(
            ['trial', 'trialing'].includes(company.subscriptionStatus)
                ? company.trialProfilesLimit
                : credit.profile + '',
        );
        const exportLimit = parseInt(
            ['trial', 'trialing'].includes(company.subscriptionStatus)
                ? EXPORT_CREDIT_TRIAL_TOTAL + ''
                : credit.export + '',
        );
        return {
            profile: profileLimit - parseInt(usage.profile + ''),
            search: searchLimit - parseInt(usage.search + ''),
            export: exportLimit - parseInt(usage.export + ''),
        };
    }
}
