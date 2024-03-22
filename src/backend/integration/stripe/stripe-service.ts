import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';
import Stripe from 'stripe';

export type ChangeSubscriptionRequestType = {
    priceId: string;
    quantity: number;
};

export default class StripeService {
    static service = new StripeService();
    static getService = () => StripeService.service;
    static client = new Stripe(process.env.STRIPE_API_KEY || '', {
        apiVersion: '2022-11-15',
    });

    async updateCustomer(cusId: string, params: Stripe.CustomerUpdateParams) {
        return await StripeService.client.customers.update(cusId, params);
    }

    async getCustomerPaymentMethods(cusId: string) {
        return await StripeService.client.paymentMethods.list({
            customer: cusId,
        });
    }

    async createConfirmedSetupIntent({
        cusId,
        paymentMethodType,
        paymentMethodId,
        currency,
        userAgent,
        ipAddress,
    }: {
        cusId: string;
        paymentMethodType: 'card' | 'alipay';
        paymentMethodId: string;
        currency: string;
        userAgent: string;
        ipAddress: string;
    }) {
        return await StripeService.client.setupIntents.create(
            {
                customer: cusId,
                payment_method_types: [paymentMethodType],
                confirm: true,
                payment_method: paymentMethodId,
                payment_method_options: {
                    //@ts-ignore the alipay is not added to Stripe.PaymentMethodOptions but it should be according to the doc https://stripe.com/docs/billing/subscriptions/alipay#create-setup-intent
                    alipay: {
                        currency,
                    },
                },
                usage: 'off_session',
                mandate_data: {
                    customer_acceptance: {
                        type: 'online',
                        online: {
                            ip_address: ipAddress,
                            user_agent: userAgent,
                        },
                    },
                },
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/undefined/${paymentMethodType}/callbacks`,
            },
            undefined,
        );
    }

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

    async changeSubscription(subscriptionId: string, { priceId, quantity }: ChangeSubscriptionRequestType) {
        const subscription = await this.retrieveSubscription(subscriptionId);
        const items = subscription.items.data.map((item) => {
            return {
                id: item.id,
                price: priceId,
                quantity,
            };
        });
        return this.updateSubscription(subscriptionId, {
            items,
            proration_behavior: 'always_invoice',
        });
    }

    async getSubscription(cusId: string) {
        return await StripeService.client.subscriptions.list({
            customer: cusId,
        });
    }

    async attachPaymentMethod(cusId: string, paymentMethodId: string) {
        return await StripeService.client.paymentMethods.attach(paymentMethodId, {
            customer: cusId,
        });
    }

    async getCustomer(cusId: string) {
        const customer = await StripeService.client.customers.retrieve(cusId);
        if (customer.deleted) {
            throw new NotFoundError('Customer not found');
        }
        return customer;
    }

    async removePaymentMethod(paymentMethodId: string) {
        return await StripeService.client.paymentMethods.detach(paymentMethodId);
    }

    async getPaymentMethods(cusId: string) {
        return await StripeService.client.paymentMethods.list({
            customer: cusId,
        });
    }

    async getDefaultPaymentMethod(cusId: string) {
        const customer = await StripeService.client.customers.retrieve(cusId);
        if (customer.deleted) {
            throw new NotFoundError('Customer not found');
        }
        return customer.invoice_settings.default_payment_method;
    }

    async updateDefaultPaymentMethod(cusId: string, paymentMethodId: string) {
        return await StripeService.client.customers.update(cusId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
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

    async getProductMetadata(subscriptionId: string) {
        const subscription = await this.retrieveSubscription(subscriptionId);

        if (!subscription || subscription.items.data.length === 0) {
            throw new NotFoundError('No subscription found');
        }
        const price = await this.getPrice(subscription.items.data[0].price.id as string);
        const product = await this.getProduct(price.product.toString());

        const { metadata, name } = product;
        const { trial_profiles, trial_searches, profiles, searches } = metadata;

        if (!profiles || !searches) {
            throw new NotFoundError('Missing product metadata');
        }

        return { name, trial_profiles, trial_searches, profiles, searches };
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

    async getAvailablePromo() {
        return StripeService.client.promotionCodes.list({ active: true });
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
