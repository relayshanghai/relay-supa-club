import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';
import type { StripePriceWithProductMetadata } from 'types';

export interface SubscriptionCreatePostBody {
    customerId: string;
    priceId: string;
}

const postHandler: NextApiHandler = async (req, res) => {
    const { customerId, priceId: price } = req.body as SubscriptionCreatePostBody;

    if (!customerId) return res.status(httpCodes.BAD_REQUEST).json({ error: { message: 'Missing customer ID' } });
    if (!price) return res.status(httpCodes.BAD_REQUEST).json({ error: { message: 'Missing price ID' } });
    // Create the subscription. Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass the client_secret from it to the front end to confirm the payment
    const priceInfo = (await stripeClient.prices.retrieve(price, {
        expand: ['data.product'],
    })) as Stripe.Response<StripePriceWithProductMetadata>;

    if (!priceInfo) {
        throw new RelayError('Failed to retrieve price');
    }
    const { trial_days } = priceInfo.product.metadata;

    if (!trial_days) {
        throw new RelayError('Missing product metadata', undefined, { sendToSentry: true });
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
        throw new RelayError('Failed to create subscription');
    }
    return res.json({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
};

export default ApiHandler({ postHandler });
