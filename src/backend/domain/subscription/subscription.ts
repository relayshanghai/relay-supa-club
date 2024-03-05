import type { NextApiRequest } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { BadRequestError } from 'src/utils/error/http-error';
import { getHostnameFromRequest } from 'src/utils/get-host';
import { serverLogger } from 'src/utils/logger-server';
import { RequestContext } from 'src/utils/request-context/request-context';
/**
 * @deprecated use SubscriptionV2Service instead
 */
export default class SubscriptionService {
    static service: SubscriptionService = new SubscriptionService();
    static getService(): SubscriptionService {
        return SubscriptionService.service;
    }
    async upgradeSubscription(priceId: string) {
        const cusId = RequestContext.getContext().customerId as string;
        const subscriptions = await stripeClient.subscriptions.list({
            customer: cusId,
        });
        const existedSubscription = subscriptions.data.find((subscription) => subscription.status === 'active');
        if (!existedSubscription) {
            throw new BadRequestError('You are not subscribed to any plan');
        }
        if (existedSubscription.items.data[0].price.id === priceId) {
            throw new BadRequestError('You are already subscribed to this plan');
        }
        // delete existing subscription item
        await stripeClient.subscriptions.update(existedSubscription.id, {
            items: [
                {
                    id: existedSubscription.items.data[0].id,
                    deleted: true,
                },
                { price: priceId },
            ],
            expand: ['latest_invoice.payment_intent'],
            off_session: true,
        });
    }

    async setupIntent(
        paymentMethodType: 'card' | 'alipay',
        priceId: string,
        currency: string,
        priceTier: string,
        couponId?: string,
        paymentMethodId?: string,
    ) {
        const customerId = RequestContext.getContext().customerId as string;
        const companyId = RequestContext.getContext().companyId as string;
        const req = RequestContext.getContext().request as NextApiRequest;
        const { appUrl } = getHostnameFromRequest(req);
        const returnUrlParams = new URLSearchParams();
        returnUrlParams.append('customerId', customerId);
        returnUrlParams.append('priceId', priceId);
        returnUrlParams.append('companyId', companyId);
        returnUrlParams.append('selectedPlan', priceTier);
        if (couponId) {
            returnUrlParams.append('couponId', couponId);
        }
        const {
            data: [customerSetupIntent],
        } = await stripeClient.setupIntents.list({
            customer: customerId,
            payment_method: paymentMethodId,
        });
        // if no intent related to the payment method, create one
        if (!customerSetupIntent || customerSetupIntent.status !== 'succeeded') {
            //create an alipay payment method to confirm the setup intent if user does not have one
            const paymentMethod = await stripeClient.paymentMethods.create({
                type: paymentMethodType,
            });
            if (!paymentMethod) {
                serverLogger('Failed to create payment method');
                throw new BadRequestError('Failed to create payment method');
            }
            //attach payment method to customer
            const paymentMethodAttach = await stripeClient.paymentMethods.attach(paymentMethod.id, {
                customer: customerId,
            });

            // set the payment method as default
            await stripeClient.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethod.id,
                },
            });

            if (!paymentMethodAttach) {
                serverLogger('Failed to attach payment method to customer');
                throw new BadRequestError('Failed to attach payment method to customer');
            }

            paymentMethodId = paymentMethod.id;

            const response = await stripeClient.setupIntents.create(
                {
                    customer: customerId,
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
                                ip_address: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
                                user_agent: req.headers['user-agent'] ?? 'Unknown user-agent',
                            },
                        },
                    },
                    return_url: `${appUrl}/payments/confirm-alipay?${returnUrlParams}`,
                },
                undefined,
            );
            return response;
        }
        //do not recreate payment intent when its already have a succeeded one
        if (customerSetupIntent.status === 'succeeded') {
            stripeClient.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                expand: ['latest_invoice.payment_intent'],
                off_session: true,
                coupon: couponId,
                payment_settings: {
                    save_default_payment_method: 'on_subscription',
                    payment_method_types: ['alipay' as any],
                },
            });
            return customerSetupIntent;
        }
    }
}
