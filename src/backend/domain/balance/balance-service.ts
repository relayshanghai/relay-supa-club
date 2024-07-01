import { BalanceType } from 'src/backend/database/balance/balance-entity';
import BalanceRepository from 'src/backend/database/balance/balance-repository';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { UsageRepository } from 'src/backend/database/usages/repository';
import { UseLogger } from 'src/backend/integration/logger/decorator';
import { v4 } from 'uuid';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import { UnprocessableEntityError } from 'src/utils/error/http-error';
export default class BalanceService {
    static service = new BalanceService();
    static getService = () => BalanceService.service;
    @UseLogger()
    async initBalance(companyId: string) {
        const balance = await BalanceRepository.getRepository().find({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (balance.length > 0) return;
        const company = await CompanyRepository.getRepository().findOne({
            where: {
                id: companyId,
            },
            relations: ['subscription'],
        });
        if (!company) return;
        const usage = await UsageRepository.getRepository().getCountUsages(companyId);
        const searchLimit = parseInt(company.searchesLimit || company.trialSearchesLimit);
        const profileLimit = parseInt(company.profilesLimit || company.trialProfilesLimit);

        await BalanceRepository.getRepository().upsert(
            [
                {
                    id: v4(),
                    company: {
                        id: companyId,
                    },
                    type: BalanceType.PROFILE,
                    amount: profileLimit - usage.profile,
                },
                {
                    id: v4(),
                    company: {
                        id: companyId,
                    },
                    type: BalanceType.SEARCH,
                    amount: searchLimit - usage.search,
                },
            ],
            {
                conflictPaths: ['company', 'type'],
            },
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
        const balance = await BalanceRepository.getRepository().findOneByOrFail({
            company: {
                id: companyId,
            },
            type,
        });
        if (balance.amount - cost <= 0) throw new UnprocessableEntityError('insuficentbalance');
    }

    @UseLogger()
    @CompanyIdRequired()
    getAllBalance() {
        const companyId = RequestContext.getContext().companyId as string;
        return BalanceRepository.getRepository().find({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
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
}
