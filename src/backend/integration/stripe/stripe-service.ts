import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';
import Stripe from 'stripe';
import type { StripePriceWithProductMetadata } from 'types';
import type { Nullable } from 'types/nullable';

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

    async createSubscription(cusId: string, priceId: string, quantity = 1, coupon: Nullable<string> = undefined) {
        const c = coupon ?? undefined;
        const paymentMethodsTypes: Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[] = ['card'];
        const price = await this.getPrice(priceId);
        const unitAmount = (price.unit_amount ?? 0) / 100;
        if (price?.currency === 'cny' && unitAmount < 3000) paymentMethodsTypes.push('alipay' as any);
        const subscription = await StripeService.client.subscriptions.create({
            customer: cusId,
            items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            payment_settings: {
                payment_method_types: paymentMethodsTypes,
            },
            collection_method: 'charge_automatically',
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
            coupon: c,
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
            expand: ['latest_invoice.payment_intent'],
            off_session: true,
        });
    }

    async getSubscription<Expand = unknown>(
        cusId: string,
        options?: Stripe.SubscriptionListParams,
    ): Promise<Stripe.ApiList<Stripe.Subscription & Expand>> {
        return StripeService.client.subscriptions.list({
            customer: cusId,
            ...options,
        }) as unknown as Stripe.ApiList<Stripe.Subscription & Expand>;
    }

    async attachPaymentMethod(cusId: string, paymentMethodId: string) {
        return await StripeService.client.paymentMethods.attach(paymentMethodId, {
            customer: cusId,
        });
    }

    async getCustomer(cusId: string, options?: Stripe.CustomerRetrieveParams) {
        const customer = await StripeService.client.customers.retrieve(cusId, options);
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

    async getLastSubscription<Expand = unknown>(
        cusId: string,
        options?: Stripe.SubscriptionListParams,
    ): Promise<Stripe.Subscription & Expand> {
        const subscriptions = await this.getSubscription(cusId, options);
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
        return lastSubscription?.[0] as Stripe.Subscription & Expand;
    }

    async getPrice(priceId: string) {
        return StripeService.client.prices.retrieve(priceId);
    }

    async getPriceByProduct(productId: string): Promise<Stripe.ApiList<StripePriceWithProductMetadata>> {
        const response = (await StripeService.client.prices.list({
            active: true,
            expand: ['data.product'],
            product: productId,
        })) as unknown as Stripe.ApiList<StripePriceWithProductMetadata>;

        if (response.has_more) {
            const nextPage = await this.getPriceByProduct(productId);
            response.data.push(...nextPage.data);
        }

        return response;
    }

    async getProduct(productId: string) {
        return StripeService.client.products.retrieve(productId);
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

    async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription & { plan?: Stripe.Plan }> {
        return StripeService.client.subscriptions.retrieve(subscriptionId) as unknown as Stripe.Subscription & {
            plan?: Stripe.Plan;
        };
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

    async getCanceledSubscription(customerId: string) {
        return this.getSubscriptionByStatus(customerId, 'canceled');
    }

    async cancelSubscription(customerId: string) {
        const [err, existingSubscription] = await awaitToError(this.getSubscriptionByStatus(customerId));
        if (err || !existingSubscription) {
            throw new NotFoundError('no subscription found');
        }
        return StripeService.client.subscriptions.cancel(existingSubscription.id);
    }

    async cancelSubscriptionBySubsId(id: string, option?: { force: boolean }) {
        if (option?.force) {
            return StripeService.client.subscriptions.cancel(id);
        }
        return StripeService.getService().updateSubscription(id, {
            cancel_at_period_end: true,
        });
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

    async getDraftInvoiceBySubscription(subscriptionId: string) {
        return StripeService.client.invoices.list({
            subscription: subscriptionId,
            status: 'draft',
        });
    }

    async getOpenInvoiceBySubscription(subscriptionId: string) {
        return StripeService.client.invoices.list({
            subscription: subscriptionId,
            status: 'open',
        });
    }

    async deleteInvoices(invoiceIds: string[]) {
        return Promise.all(invoiceIds.map((id) => StripeService.client.invoices.del(id)));
    }

    async removeExistingInvoiceBySubscription(subscriptionId: string) {
        const draftInvoices = await this.getDraftInvoiceBySubscription(subscriptionId);
        const invoices = [...draftInvoices.data];
        await this.deleteInvoices(invoices.map((invoice) => invoice.id));
    }

    getSubscriptionInterval(interval: string) {
        switch (interval) {
            case 'month':
                return 'monthly';
            case 'year':
                return 'annually';
            default:
                return 'monthly';
        }
    }

    async getSubscriptionsByStatus(customerId: string, status: Stripe.SubscriptionListParams.Status = 'active') {
        const subscription = await StripeService.client.subscriptions.list({
            customer: customerId,
            status,
            expand: ['data.plan.product'],
        });
        return subscription.data;
    }

    async getAllSubscriptions() {
        const subscriptions: Stripe.Subscription[] = [];
        const statuses: Stripe.SubscriptionListParams.Status[] = ['active', 'trialing', 'incomplete'];

        let lastId: string | undefined = undefined;
        for (const status of statuses) {
            while (true) {
                const subs = (await StripeService.client.subscriptions.list({
                    limit: 100,
                    starting_after: lastId,
                    status,
                    expand: ['data.customer', 'data.plan', 'data.plan.product'],
                })) as Stripe.ApiList<Stripe.Subscription>;
                subscriptions.push(...subs.data);
                if (!subs.has_more) {
                    break;
                } else {
                    lastId = subs.data[subs.data.length - 1].id;
                }
            }
        }
        return subscriptions;
    }

    async getAllCustomers() {
        const customers: Stripe.Customer[] = [];

        let lastId: string | undefined = undefined;
        while (true) {
            const subs = (await StripeService.client.customers.list({
                limit: 100,
                starting_after: lastId,
                expand: ['data.subscriptions', 'data.subscriptions.data.plan'],
            })) as Stripe.ApiList<Stripe.Customer>;
            customers.push(...subs.data);
            if (!subs.has_more) {
                break;
            } else {
                lastId = subs.data[subs.data.length - 1].id;
            }
        }
        return customers.filter((customer) => (customer as any).subscriptions.data.length > 0);
    }

    async createPaymentIntent({
        priceId,
        quantity,
        customerId,
        paymentMethodTypes,
    }: {
        priceId: string;
        quantity: number;
        customerId: string;
        paymentMethodTypes?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
    }) {
        const price = await this.getPrice(priceId);
        const pi = await StripeService.client.paymentIntents.create({
            amount: (price.unit_amount ?? 0) * quantity,
            currency: price.currency,
            payment_method_types: paymentMethodTypes,
            customer: customerId,
            description: `Payment for ${price.product}`,
        });
        return pi;
    }

    async createCheckoutSession({
        priceId,
        quantity,
        customerId,
        paymentMethodTypes = ['card', 'alipay'],
    }: {
        priceId: string;
        quantity: number;
        customerId: string;
        paymentMethodTypes?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
    }): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        const session = await StripeService.client.checkout.sessions.create({
            payment_method_types: paymentMethodTypes,
            mode: 'payment',
            line_items: [
                {
                    price: priceId,
                    quantity,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
            customer: customerId,
        });

        return session;
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
