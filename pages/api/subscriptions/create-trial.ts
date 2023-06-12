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

    if (!customerId) {
        throw new RelayError('Missing customer ID', httpCodes.BAD_REQUEST);
    }
    if (!price) {
        throw new RelayError('Missing price ID', httpCodes.BAD_REQUEST);
    }

    const priceInfo = (await stripeClient.prices.retrieve(price, {
        expand: ['data.product'],
    })) as Stripe.Response<StripePriceWithProductMetadata>;

    if (!priceInfo) {
        throw new RelayError('Failed to retrieve price');
    }
    const { trial_days } = priceInfo.product.metadata;

    if (!trial_days) {
        throw new RelayError('Missing product metadata', httpCodes.INTERNAL_SERVER_ERROR, { sendToSentry: true });
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
    // This doesn't actually create an active subscription, just the invoice/intent.
    // We can pass the client_secret from it to the front end to confirm the payment
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
    // Because this doesn't actually start the subscription, we'll need to rely on the webhook to update the subscription status
    return res.json({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
};

export default ApiHandler({ postHandler });
