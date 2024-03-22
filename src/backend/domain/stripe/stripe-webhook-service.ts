import { StripeWebhookType, type StripeWebhookRequest } from 'pages/api/v2/stripe-webhook/request';
import BillingEventRepository from 'src/backend/database/billing-event/billing-event-repository';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { type ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import SlackService from 'src/backend/integration/slack/slack-service';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import type Stripe from 'stripe';
import dayjs from 'dayjs';
import { logger } from 'src/backend/integration/logger';

export class StripeWebhookService {
    public static readonly service: StripeWebhookService = new StripeWebhookService();
    static getService(): StripeWebhookService {
        return StripeWebhookService.service;
    }

    async handler(request: StripeWebhookRequest) {
        const company = await CompanyRepository.getRepository().findOne({
            where: {
                cusId: request.data?.object.customer as string,
            },
        });
        if (!company) {
            throw new Error('Company not found');
        }

        try {
            await BillingEventRepository.getRepository().save({
                company,
                data: request.data?.object,
                provider: 'stripe',
                type: request.type,
            });
            await SubscriptionRepository.getRepository().update(
                {
                    company,
                },
                {
                    providerLastEvent: new Date(request.created * 1000).toString(),
                },
            );
            await this.handlingWebhookTypes(request);
        } catch (error) {
            logger.error('Error handling stripe webhook', error);
        }
        return { message: 'Webhook received' };
    }

    private async handlingWebhookTypes(request: StripeWebhookRequest) {
        switch (request.type) {
            case StripeWebhookType.CHARGE_SUCCEEDED:
            case StripeWebhookType.INVOICE_PAID:
                return this.chargeSucceededHandler(request.data);
            case StripeWebhookType.CHARGE_FAILED:
            case StripeWebhookType.INVOICE_PAYMENT_FAILED:
                return this.chargeFailedHandler(
                    request.data as StripeWebhookRequest<Stripe.Charge | Stripe.Invoice>['data'],
                    request.type,
                );
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_CREATED:
                return this.customerSubscriptionCreatedHandler(
                    request.data as StripeWebhookRequest<Stripe.Subscription>['data'],
                );
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_UPDATED:
                return this.customerSubscriptionUpdatedHandler(
                    request.data as StripeWebhookRequest<Stripe.Subscription>['data'],
                );
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END:
                return this.customerSubscriptionTrialWillEndHandler(
                    request.data as StripeWebhookRequest<Stripe.Subscription>['data'],
                );
        }
    }

    private async chargeSucceededHandler(data: StripeWebhookRequest['data']) {
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    cusId: data?.object.customer as string,
                },
            },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        const stripeSubscription = await StripeService.getService().retrieveSubscription(
            subscription.providerSubscriptionId,
        );
        if (!stripeSubscription) {
            throw new Error('Stripe subscription not found');
        }
        subscription.pausedAt = new Date(stripeSubscription.current_period_end * 1000);
        subscription.cancelledAt = null;
        await SubscriptionRepository.getRepository().save(subscription);
    }

    private async chargeFailedHandler(
        data: StripeWebhookRequest<Stripe.Charge | Stripe.Invoice>['data'],
        type?: StripeWebhookType,
    ) {
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    cusId: data?.object.customer as string,
                },
            },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        subscription.cancelledAt = new Date();
        await SubscriptionRepository.getRepository().save(subscription);

        if (type === StripeWebhookType.INVOICE_PAYMENT_FAILED) {
            const company = subscription.company;
            const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
            await SlackService.getService().sendFailedRecurringMessage({
                company,
                profile,
                paymentIntent: (data.object as Stripe.Invoice).payment_intent as string,
            });
        }
    }

    private async customerSubscriptionCreatedHandler(data: StripeWebhookRequest<Stripe.Subscription>['data']) {
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    cusId: data?.object.customer as string,
                },
            },
            relations: {
                company: {
                    profiles: true,
                },
            },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        const company = subscription.company;
        const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
        await SlackService.getService().sendSignupMessage({ company, profile });
    }

    private async customerSubscriptionUpdatedHandler(data: StripeWebhookRequest<Stripe.Subscription>['data']) {
        const previousData = { items: data.previous_attributes?.items } as Stripe.Subscription;
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    cusId: data?.object.customer as string,
                },
            },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        const company = subscription.company;
        const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
        if (data.object.cancel_at !== null && data.object.status === 'active') {
            await SlackService.getService().sendCancelSubscriptionMessage({
                company,
                profile,
                subscription: data.object,
            });
        }
        if (data.object.cancel_at === null && data.object.status === 'active' && previousData.cancel_at !== null) {
            await SlackService.getService().sendResumeSubscriptionMessage({
                company,
                profile,
                subscription: data.object,
            });
        } else {
            await SlackService.getService().sendChangePlanMessage({
                company,
                profile,
                newSubscription: data.object,
                oldSubscription: previousData,
            });
        }
    }

    private async customerSubscriptionTrialWillEndHandler(data: StripeWebhookRequest<Stripe.Subscription>['data']) {
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    cusId: data?.object.customer as string,
                },
            },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        const company = subscription.company;
        const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
        const date = dayjs.unix(data.object.trial_end as number);
        const diffInDays = dayjs().diff(date, 'day');
        await SlackService.getService().sendTrialEndingMessage({
            company,
            profile,
            trialDayExpiring: Math.abs(diffInDays),
        });
    }
}
