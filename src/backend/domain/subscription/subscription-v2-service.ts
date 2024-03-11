import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import type { CreateSubscriptionRequest } from 'pages/api/v2/subscriptions/request';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import { RequestContext } from 'src/utils/request-context/request-context';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import { BadRequestError } from 'src/utils/error/http-error';
import { SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import type { StripeSubscription } from 'src/backend/integration/stripe/type';
import StripeService from 'src/backend/integration/stripe/stripe-service';

export default class SubscriptionV2Service {
    static service: SubscriptionV2Service;
    static getService(): SubscriptionV2Service {
        if (!SubscriptionV2Service.service) {
            SubscriptionV2Service.service = new SubscriptionV2Service();
        }
        return SubscriptionV2Service.service;
    }
    @CompanyIdRequired()
    @UseLogger()
    @UseTransaction()
    async createSubscription(request: CreateSubscriptionRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const cusId = RequestContext.getContext().customerId as string;
        const existedSubscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (existedSubscription) {
            const stripeSubscriptionEntity =
                SubscriptionEntity.getSubscriptionEntity<StripeSubscription>(existedSubscription);
            if (
                stripeSubscriptionEntity.subscriptionData.items.data.find((item) => item.price.id === request.priceId)
            ) {
                throw new BadRequestError('You are already subscribed to this plan');
            }
        }

        const subscription = await StripeService.getService().createSubscription(
            cusId,
            request.priceId,
            request.quantity,
        );
        return {
            providerSubscriptionId: subscription.id,
            clientSecret: subscription.clientSecret,
        };
    }

    @UseTransaction()
    async syncStripeSubscriptionWithDb(companyId: string, cusId: string) {
        const lastSubscription = await StripeService.getService().getLastSubscription(cusId);

        return await SubscriptionRepository.getRepository().save({
            company: {
                id: companyId,
            },
            provider: 'stripe',
            providerSubscriptionId: lastSubscription.id,
            paymentMethod:
                lastSubscription.payment_settings?.payment_method_types?.[0] ||
                lastSubscription.default_payment_method?.toString() ||
                'card',
            quantity: lastSubscription.items.data[0].quantity,
            price: lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0,
            total:
                (lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0) *
                (lastSubscription?.items?.data?.[0].quantity ?? 0),
            subscriptionData: lastSubscription,
            discount: lastSubscription.discount?.coupon?.amount_off?.valueOf() || 0,
            coupon: lastSubscription.discount?.coupon?.id,
            activeAt: lastSubscription.current_period_start
                ? new Date(lastSubscription.current_period_start * 1000)
                : undefined,
            pausedAt: lastSubscription.pause_collection?.behavior === 'void' ? new Date() : undefined,
            cancelledAt: lastSubscription.cancel_at ? new Date(lastSubscription.cancel_at * 1000) : undefined,
        });
    }

    @CompanyIdRequired()
    @UseLogger()
    async getSubscription() {
        const companyId = RequestContext.getContext().companyId as string;
        const cusId = RequestContext.getContext().customerId as string;
        let subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (!subscription) {
            subscription = await this.syncStripeSubscriptionWithDb(companyId, cusId);
        }
        return subscription;
    }
}
