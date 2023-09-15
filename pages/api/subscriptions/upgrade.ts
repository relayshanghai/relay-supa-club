import type { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import httpCodes from 'src/constants/httpCodes';
import type { RelayPlanStripeProduct } from 'types';
import { unixEpochToISOString } from 'src/utils/utils';
import { updateCompanySubscriptionStatus, updateCompanyUsageLimits } from 'src/utils/api/db';
import type Stripe from 'stripe';
import { createSubscriptionErrors } from 'src/errors/subscription';

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

            if (!activeSubscription) {
                const trialSubscriptions = await stripeClient.subscriptions.list({
                    customer,
                    status: 'trialing',
                });
                activeSubscription = trialSubscriptions.data[0];
                if (!activeSubscription) {
                    return res
                        .status(httpCodes.FORBIDDEN)
                        .json({ error: createSubscriptionErrors.noActiveSubscriptionToUpgrade });
                }
            }

            //create a new subscription and cancel current one

            const subscription = await stripeClient.subscriptions.create({
                customer,
                payment_behavior: 'default_incomplete',
                items: [{ price: priceId }],
                payment_settings: { save_default_payment_method: 'on_subscription' },
                proration_behavior: 'create_prorations',
                expand: ['latest_invoice.payment_intent'],
            });

            const payment_intent = (subscription.latest_invoice as Stripe.Invoice).payment_intent;
            res.send({
                type: 'payment',
                clientSecret: (payment_intent as Stripe.PaymentIntent).client_secret,
            });

            // only cancel old subscription after new one is created successfully
            await stripeClient.subscriptions.cancel(activeSubscription.id, {
                invoice_now: true,
                prorate: true,
            });
            if (subscription.status === 'active') {
                //code from create.ts to update company usage limits and subscription status in db
                const price = await stripeClient.prices.retrieve(priceId);
                const product = (await stripeClient.products.retrieve(
                    price.product as string,
                )) as RelayPlanStripeProduct;

                const subscription_start_date = unixEpochToISOString(subscription.start_date);
                if (!subscription_start_date) throw new Error('Missing subscription start date');

                const { profiles, searches, ai_emails } = product.metadata;
                if (!profiles || !searches || !ai_emails) {
                    serverLogger('Missing product metadata: ' + JSON.stringify({ product, price }));
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
            return res.status(httpCodes.BAD_REQUEST).json(subscription);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
