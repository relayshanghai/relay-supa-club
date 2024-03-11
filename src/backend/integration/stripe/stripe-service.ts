import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import Stripe from 'stripe';

export default class StripeService {
    static service = new StripeService();
    static getService = () => StripeService.service;
    static client = new Stripe(process.env.STRIPE_API_KEY || '', {
        apiVersion: '2022-11-15',
    });

    async createSubscription(cusId: string, priceId: string, quantity = 1) {
        const subscription = await StripeService.client.subscriptions.create({
            customer: cusId,
            items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            payment_settings: {
                payment_method_types: ['card', 'alipay' as any],
            },
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
        return {
            id: subscription.id,
            clientSecret: paymentIntent.client_secret,
        };
    }

    async getSubscription(cusId: string) {
        return await StripeService.client.subscriptions.list({
            customer: cusId,
        });
    }

    async getLastSubscription(cusId: string) {
        const subscriptions = await this.getSubscription(cusId);
        let lastSubscription = subscriptions.data.filter((sub) => {
            return sub.status === 'active' || sub.status === 'trialing';
        });
        if (lastSubscription.length === 0) {
            lastSubscription = subscriptions.data
                .filter((sub) => {
                    return sub.status === 'past_due';
                })
                .sort((a, b) => {
                    return new Date(b.current_period_start).getTime() - new Date(a.current_period_start).getTime();
                });
        }
        return lastSubscription[0];
    }

    async syncSubscriptionWithDb(companyId: string, subscriptionData: Stripe.Subscription) {
        const subscription = await SubscriptionRepository.getRepository().save({
            company: {
                id: companyId,
            },
            provider: 'stripe',
            providerSubscriptionId: subscriptionData.id,
            paymentMethod:
                subscriptionData.payment_settings?.payment_method_types?.[0] ||
                subscriptionData.default_payment_method?.toString() ||
                'card',
            quantity: subscriptionData.items.data[0].quantity,
            price: subscriptionData.items.data[0].price.unit_amount?.valueOf() || 0,
            total:
                (subscriptionData.items.data[0].price.unit_amount?.valueOf() || 0) *
                (subscriptionData?.items?.data?.[0].quantity ?? 0),
            subscriptionData: subscriptionData,
            discount: subscriptionData.discount?.coupon?.amount_off?.valueOf() || 0,
            coupon: subscriptionData.discount?.coupon?.id,
            activeAt: subscriptionData.current_period_start
                ? new Date(subscriptionData.current_period_start * 1000)
                : undefined,
            pausedAt: subscriptionData.pause_collection?.behavior === 'void' ? new Date() : undefined,
            cancelledAt: subscriptionData.cancel_at ? new Date(subscriptionData.cancel_at * 1000) : undefined,
        });

        return subscription;
    }
}
