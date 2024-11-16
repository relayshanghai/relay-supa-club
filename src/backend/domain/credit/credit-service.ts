import { CompanyEntity } from 'src/backend/database/company/company-entity';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { SubscriptionEntity, SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
import TopupCreditRepository from 'src/backend/database/topup-credits/topup-credits-repository';
import { RequestContext } from 'src/utils/request-context/request-context';
import { IsNull, Not } from 'typeorm';
import { type CreditType } from 'types/credit';

export class CreditService {
    static service = new CreditService();
    static getService = () => CreditService.service;
    async getTotalCredit(): Promise<CreditType> {
        const companyId = RequestContext.getContext().companyId as string;
        const company = await CompanyRepository.getRepository().findOneBy({
            id: companyId,
        });
        const topUpCredit = await TopupCreditRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
                paymentTransaction: {
                    paidAt: Not(IsNull()),
                },
            },
            relations: {
                company: true,
                paymentTransaction: true,
                plan: true,
            },
        });

        let searchCredit = company?.searchesLimit ? +company?.searchesLimit : 0;
        let profileCredit = company?.profilesLimit ? +company?.profilesLimit : 0;

        if (topUpCredit) {
            searchCredit += topUpCredit.plan.searches;
            profileCredit += topUpCredit.plan.profiles;
        }

        return {
            profile: profileCredit,
            search: searchCredit,
        };
    }

    private getPeriods({ company, subscription }: { company: CompanyEntity; subscription: SubscriptionEntity }): {
        periodStart: Date;
        periodEnd: Date;
    } {
        if (subscription?.status === SubscriptionStatus.TRIAL) {
            return {
                periodStart: company?.subscriptionCurrentPeriodStart as Date,
                periodEnd: company?.subscriptionCurrentPeriodEnd as Date,
            };
        }
        return {
            periodStart: subscription?.activeAt as Date,
            periodEnd: subscription?.pausedAt as Date,
        };
    }
}
