import { type StripeWebhookRequest } from 'pages/api/v2/stripe-webhook/request';
import BillingEventRepository from 'src/backend/database/billing-event/billing-event-repository';
import CompanyRepository from 'src/backend/database/company/company-repository';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';

export class StripeWebhookService {
    public static readonly service: StripeWebhookService = new StripeWebhookService();
    static getService(): StripeWebhookService {
        return StripeWebhookService.service;
    }

    async handler(request: StripeWebhookRequest) {
        console.log('stripe webhook:', JSON.stringify(request));
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
        return request;
    }

    private async handlingWebhookTypes(request: StripeWebhookRequest) {
        switch (request.type) {
            case 'charge.succeeded':
                return this.handlingChargeSucceeded(request.data);
            case 'charge.failed':
                break;
            case 'charge.expired':
                break;
        }
    }

    private async handlingChargeSucceeded(data: StripeWebhookRequest['data']) {}
}
