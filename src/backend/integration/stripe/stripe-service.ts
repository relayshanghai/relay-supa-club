import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';
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
        return lastSubscription?.[0];
    }

    async getPrice(priceId: string) {
        return await StripeService.client.prices.retrieve(priceId);
    }

    async getProduct(productId: string) {
        return await StripeService.client.products.retrieve(productId);
    }

    async getSubscriptionProductMetadata(cusId: string) {
        const lastSubscription = await this.getLastSubscription(cusId);

        if (!lastSubscription || lastSubscription.items.data.length === 0) {
            throw new NotFoundError('No subscription found');
        }
        const price = await this.getPrice(lastSubscription.items.data[0].price.id as string);
        const product = await this.getProduct(price.product.toString());

        const { trial_profiles, trial_searches, profiles, searches } = product.metadata;

        if (!profiles || !searches) {
            throw new NotFoundError('Missing product metadata');
        }

        return { trial_profiles, trial_searches, profiles, searches };
    }

    async updateSubscription(subscriptionId: string, params: Stripe.SubscriptionUpdateParams) {
        return StripeService.client.subscriptions.update(subscriptionId, params);
    }

    async retrieveSubscription(subscriptionId: string) {
        return StripeService.client.subscriptions.retrieve(subscriptionId);
    }

    async getActiveSubscription(customerId: string) {
        return this.getSubscriptionByStatus(customerId);
    }

    async getTrialSubscription(customerId: string) {
        return this.getSubscriptionByStatus(customerId, 'trialing');
    }

    async getIncompleteSubscription(customerId: string) {
        return this.getSubscriptionByStatus(customerId, 'incomplete');
    }

    async cancelSubscription(customerId: string) {
        const [err, existingSubscription] = await awaitToError(this.getSubscriptionByStatus(customerId));
        if (err || !existingSubscription) {
            throw new NotFoundError('no subscription found');
        }
        return StripeService.client.subscriptions.cancel(existingSubscription.id);
    }

    async getPaymentIntent(paymentIntentId: string) {
        return StripeService.client.paymentIntents.retrieve(paymentIntentId);
    }

    async deleteSubscription(subscriptionId: string) {
        return StripeService.client.subscriptions.del(subscriptionId);
    }

    private async getSubscriptionByStatus(customerId: string, status: Stripe.SubscriptionListParams.Status = 'active') {
        const subscription = await StripeService.client.subscriptions.list({
            customer: customerId,
            status,
            expand: ['data.plan.product'],
        });
        return subscription.data[0];
    }
}
