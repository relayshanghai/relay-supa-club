import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST')
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({ error: { message: 'Method not allowed' } });
    try {
        const customerId = req.body.customerId;
        const priceId = req.body.priceId;
        if (!customerId) return res.status(httpCodes.BAD_REQUEST).json({ error: { message: 'Missing customer ID' } });
        if (!priceId) return res.status(httpCodes.BAD_REQUEST).json({ error: { message: 'Missing price ID' } });
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass it to the front end to confirm the payment
        const subscription = await stripeClient.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price: priceId,
                },
            ],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });
        // console.log({ subscription });
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
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: { message: error.message } });
    }
}
