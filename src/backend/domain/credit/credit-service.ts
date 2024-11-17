import type { CompanyEntity } from 'src/backend/database/company/company-entity';
import CompanyRepository from 'src/backend/database/company/company-repository';
import type { SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import { SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
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
        const topUpCredits = await TopupCreditRepository.getRepository().find({
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

        if (topUpCredits.length > 0) {
            searchCredit += topUpCredits.reduce((acc, topUpCredit) => acc + topUpCredit.plan.searches, 0);
            profileCredit += topUpCredits.reduce((acc, topUpCredit) => acc + topUpCredit.plan.profiles, 0);
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
