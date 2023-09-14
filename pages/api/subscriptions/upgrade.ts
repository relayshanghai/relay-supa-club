import type { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import httpCodes from 'src/constants/httpCodes';
import type { RelayPlanStripeProduct } from 'types';
import { unixEpochToISOString } from 'src/utils/utils';
import { updateCompanySubscriptionStatus, updateCompanyUsageLimits } from 'src/utils/api/db';
import type Stripe from 'stripe';
import { createSubscriptionErrors } from 'src/errors/subscription';
import type { PaymentIntent } from '@stripe/stripe-js';

export type SubscriptionUpgradePostBody = {
    companyId: string;
    customer: string;
    priceId: string;
    couponId?: string;
};

export interface SubscriptionUpgradePostResponse extends Stripe.Response<Stripe.Subscription> {
    type: Stripe.Subscription.Status;
    clientSecret: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { companyId, customer, priceId } = req.body as SubscriptionUpgradePostBody;
        try {
            const subscriptions = await stripeClient.subscriptions.list({
                customer,
                status: 'active',
            });
            let activeSubscription = subscriptions.data[0];
            console.log('activeSubscription', activeSubscription);
            if (!activeSubscription) {
                const trialSubscriptions = await stripeClient.subscriptions.list({
                    customer,
                    status: 'trialing',
                });
                activeSubscription = trialSubscriptions.data[0];
                if (!activeSubscription) {
                    await updateCompanySubscriptionStatus({
                        subscription_status: 'canceled',
                        id: companyId,
                    })

                    return res
                        .status(httpCodes.OK)
                        .json({ error: createSubscriptionErrors.noActiveSubscriptionToUpgrade });
                }
            }

            console.log("creating payment method")
            const paymentMethod = await stripeClient.paymentMethods.create({
                type: 'alipay',
            });

            console.log("attaching payment method to customer")
            await stripeClient.paymentMethods.attach(paymentMethod.id, {
                customer: customer,
            });

            const price = await stripeClient.prices.retrieve(priceId);
            //create a new subscription and cancel current one
            const subscription = await stripeClient.subscriptions.create({
                customer,
                payment_behavior: 'allow_incomplete',
                default_payment_method: paymentMethod.id,
                items: [{ price: priceId }],
            });
            console.log("===============================")

            const payment_intent = (subscription.latest_invoice as Stripe.Invoice).payment_intent;
            if (payment_intent) {
                console.log("I got called");
                console.log("=========>>>> creating payment intent")
            const paymentIntent = await stripeClient.paymentIntents.update((payment_intent as PaymentIntent).id, {
                    setup_future_usage: 'off_session',
                    payment_method: paymentMethod.id,
                    mandate_data: {
                        customer_acceptance: {
                            type: 'online',
                            online: {
                                ip_address: (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string,
                                user_agent: req.headers['user-agent'] as string,
                            }
                        },
                    },
                });

                // Step 4: Confirm the PaymentIntent
                await stripeClient.paymentIntents.confirm(
                    (payment_intent as PaymentIntent).id, {
                        return_url: "http://localhost:3000/payments/success"
                    }
                );
                console.log("+++++++++++++++++++++++++++++++")
                res.send({
                    type: 'payment',
                    clientSecret: (payment_intent as Stripe.PaymentIntent).client_secret,
                });
            }

            // only cancel old subscription after new one is created successfully
            if(subscription && subscription.status === 'active')
            {
                await stripeClient.subscriptions.cancel(activeSubscription.id, {
                    invoice_now: true,
                    prorate: true,
                });

                //code from create.ts to update company usage limits and subscription status in db
                const product = (await stripeClient.products.retrieve(price.product as string)) as RelayPlanStripeProduct;

                const subscription_start_date = unixEpochToISOString(subscription.start_date);
                if (!subscription_start_date) throw new Error('Missing subscription start date');

                const { profiles, searches, ai_emails } = product.metadata;
                if (!profiles || !searches || !ai_emails) {
                    serverLogger('Missing product metadata: ' + JSON.stringify({ product, price }), 'error', true);
                    throw new Error('Missing product metadata');
                }

                await updateCompanyUsageLimits({
                    profiles_limit: profiles,
                    searches_limit: searches,
                    ai_email_generator_limit: ai_emails,
                    id: companyId,
                });

                await updateCompanySubscriptionStatus({
                    subscription_status: 'active',
                    subscription_start_date,
                    subscription_current_period_start: unixEpochToISOString(subscription.current_period_start),
                    subscription_current_period_end: unixEpochToISOString(subscription.current_period_end),
                    id: companyId,
                });

                return res.status(httpCodes.OK).json(subscription);
            }
            else {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(subscription);
            }
        } catch (error) {
            serverLogger(error, 'error', true);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
