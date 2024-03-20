import { type StripeWebhookRequest } from 'pages/api/v2/stripe-webhook/request';
import BillingEventRepository from 'src/backend/database/billing-event/billing-event-repository';
import CompanyRepository from 'src/backend/database/company/company-repository';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
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
            case 'charge.succeeded':
                return this.chargeSucceededHandler(request.data);
            case 'charge.failed':
                return this.chargeFailedHandler(request.data);
            case 'charge.expired':
                return this.chargeExpiredHandler(request.data);
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

    private async chargeExpiredHandler(data: StripeWebhookRequest['data']) {
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
        if (!subscription.cancelledAt) {
            subscription.cancelledAt = new Date();
        }
        await SubscriptionRepository.getRepository().save(subscription);
        await StripeService.getService().cancelSubscription(subscription.providerSubscriptionId);
    }
}
