import { StripeWebhookType, type StripeWebhookRequest } from 'pages/api/v2/stripe-webhook/request';
import BillingEventRepository from 'src/backend/database/billing-event/billing-event-repository';
import CompanyRepository from 'src/backend/database/company/company-repository';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import SlackService from 'src/backend/integration/slack/slack-service';
import StripeService from 'src/backend/integration/stripe/stripe-service';

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
        return request;
    }

    private async handlingWebhookTypes(request: StripeWebhookRequest) {
        switch (request.type) {
            case StripeWebhookType.CHARGE_SUCCEEDED:
            case StripeWebhookType.INVOICE_PAID:
                return this.chargeSucceededHandler(request.data);
            case StripeWebhookType.CHARGE_FAILED:
            case StripeWebhookType.INVOICE_PAYMENT_FAILED:
                return this.chargeFailedHandler(request.data);
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_CREATED:
                return this.customerSubscriptionCreatedHandler(request.data);
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_UPDATED:
                return this.customerSubscriptionUpdatedHandler(request.data);
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END:
                return this.customerSubscriptionTrialWillEndHandler(request.data);
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

    private async chargeFailedHandler(data: StripeWebhookRequest['data']) {
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
    }

    private async customerSubscriptionCreatedHandler(data: StripeWebhookRequest['data']) {
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
        const stripeSubscription = await StripeService.getService().retrieveSubscription(
            subscription.providerSubscriptionId,
        );
        if (!stripeSubscription) {
            throw new Error('Stripe subscription not found');
        }
        subscription.pausedAt = new Date(stripeSubscription.current_period_end * 1000);
        subscription.cancelledAt = null;
        await SubscriptionRepository.getRepository().save(subscription);
        await SlackService.getService().sendSignupMessage({ company: subscription.company });
    }

    private async customerSubscriptionUpdatedHandler(data: StripeWebhookRequest['data']) {
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

    private async customerSubscriptionTrialWillEndHandler(data: StripeWebhookRequest['data']) {
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
}
