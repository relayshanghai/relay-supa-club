import type { CompanyEntity } from 'src/backend/database/company/company-entity';
import CompanyRepository from 'src/backend/database/company/company-repository';
import type { SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import { SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import TopupCreditRepository from 'src/backend/database/topup-credits/topup-credits-repository';
import { EXPORT_CREDIT_MAX_TOTAL, EXPORT_CREDIT_TRIAL_TOTAL } from 'src/constants/credits';
import { RequestContext } from 'src/utils/request-context/request-context';
import { IsNull, Not } from 'typeorm';
import { type CreditType } from 'types/credit';

export class CreditService {
    static service = new CreditService();
    static getService = () => CreditService.service;
    async getTotalCredit(): Promise<CreditType> {
        const companyId = RequestContext.getContext().companyId as string;
        const subscription = await SubscriptionRepository.getRepository().findOneBy({
            company: {
                id: companyId,
            },
        });
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
        let exportCredit = EXPORT_CREDIT_MAX_TOTAL;

        if (
            [SubscriptionStatus.TRIAL, SubscriptionStatus.TRIAL_EXPIRED, SubscriptionStatus.TRIAL_CANCELLED].includes(
                subscription?.status as SubscriptionStatus,
            )
        ) {
            searchCredit = company?.trialSearchesLimit ? +company?.trialSearchesLimit : 0;
            profileCredit = company?.trialProfilesLimit ? +company?.trialProfilesLimit : 0;
            exportCredit = EXPORT_CREDIT_TRIAL_TOTAL;
        }

        if (topUpCredits.length > 0) {
            searchCredit += topUpCredits.reduce((acc, topUpCredit) => acc + topUpCredit.plan.searches, 0);
            profileCredit += topUpCredits.reduce((acc, topUpCredit) => acc + topUpCredit.plan.profiles, 0);
        }

        return {
            profile: profileCredit,
            search: searchCredit,
            export: exportCredit,
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
