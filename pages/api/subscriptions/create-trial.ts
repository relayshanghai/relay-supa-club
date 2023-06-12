import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import type Stripe from 'stripe';
import type { StripePriceWithProductMetadata } from 'types';

export interface SubscriptionCreatePostBody {
    customerId: string;
    priceId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST')
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({ error: { message: 'Method not allowed' } });
    try {
        const { customerId, priceId: price } = req.body as SubscriptionCreatePostBody;

        if (!customerId) return res.status(httpCodes.BAD_REQUEST).json({ error: { message: 'Missing customer ID' } });
        if (!price) return res.status(httpCodes.BAD_REQUEST).json({ error: { message: 'Missing price ID' } });
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass the client_secret from it to the front end to confirm the payment

        const priceInfo = (await stripeClient.prices.retrieve(price, {
            expand: ['data.product'],
        })) as Stripe.Response<StripePriceWithProductMetadata>;

        if (!priceInfo) throw new Error('Failed to retrieve price');
        const { trial_days, trial_profiles, trial_searches } = priceInfo.product.metadata;

        if (!trial_days || !trial_profiles || !trial_searches) {
            serverLogger(new Error('Missing product metadata'), 'error', true);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
        const createParams: Stripe.SubscriptionCreateParams = {
            customer: customerId,
            items: [{ price }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            proration_behavior: 'create_prorations',
            trial_period_days: Number(trial_days),
        };
        const subscription = await stripeClient.subscriptions.create(createParams);
        if (
            !subscription?.latest_invoice ||
            typeof subscription.latest_invoice === 'string' ||
            !subscription.latest_invoice.payment_intent ||
            typeof subscription.latest_invoice.payment_intent === 'string' ||
            !subscription.latest_invoice.payment_intent.client_secret
        ) {
            throw new Error('Failed to create subscription');
        }
        return res.json({
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (error: any) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}
