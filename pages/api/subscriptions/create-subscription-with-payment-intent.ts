import type { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import httpCodes from 'src/constants/httpCodes';
import type Stripe from 'stripe';
import { ApiHandler } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';

export type SubscriptionUpgradePostRequestBody = {
    companyId: string;
    cusId: string;
    priceId: string;
    couponId?: string;
};

export interface SubscriptionUpgradePostResponse extends Stripe.Response<Stripe.Subscription> {
    clientSecret: string | null;
    newSubscriptionId: string;
    oldSubscriptionId: string;
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { cusId, priceId } = req.body as SubscriptionUpgradePostRequestBody;
    if (!cusId || !priceId) {
        serverLogger('Missing cusId, priceId');
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing cusId, priceId' });
    }
    // retrieve current subscription id
    const oldSubscription = await stripeClient.subscriptions.list({
        customer: cusId,
    });
    if (oldSubscription.data.length > 1) {
        serverLogger('More than one subscription found for customer: ' + cusId);
        return res
            .status(httpCodes.BAD_REQUEST)
            .json({ error: 'More than one subscription found for customer: ' + cusId });
    }

    if (!Array.isArray(oldSubscription.data)) {
        serverLogger(new Error('cannot_retrieve_customer_subscription'), (scope) => {
            return scope.setContext('stripe_subscriptions_list', { response: oldSubscription });
        });
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Cannot retrieve customer subscription' });
    }

    const oldSubscriptionId = oldSubscription.data[0].id;

    // create a new subscription with the attached paymentMethod
    const subscription = await stripeClient.subscriptions.create({
        customer: cusId,
        payment_behavior: 'default_incomplete',
        items: [{ price: priceId }],
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        coupon: 'oUeyBQjU',
    });

    const paymentIntent = (subscription.latest_invoice as Stripe.Invoice).payment_intent;
    const response: SubscriptionUpgradePostResponse = {
        clientSecret: (paymentIntent as Stripe.PaymentIntent).client_secret,
        newSubscriptionId: subscription.id,
        oldSubscriptionId,
        ...subscription,
    };
    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({
    postHandler,
});
