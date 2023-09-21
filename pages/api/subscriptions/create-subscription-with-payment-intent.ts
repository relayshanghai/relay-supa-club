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
    type: Stripe.Subscription.Status;
    clientSecret: string;
    subscriptionId: string;
    oldSubscriptionId: string;
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { cusId, priceId } = req.body as SubscriptionUpgradePostRequestBody;
    if (!cusId || !priceId) {
        serverLogger('Missing cusId, priceId');
        return res.status(httpCodes.BAD_REQUEST).json('Missing cusId, priceId');
    }
    // retrieve current subscription id
    const oldSubscription = await stripeClient.subscriptions.list({
        customer: cusId,
    });
    if (oldSubscription.data.length > 1) {
        serverLogger('More than one subscription found for customer: ' + cusId);
        return res.status(httpCodes.BAD_REQUEST).json('More than one subscription found for customer');
    }
    const oldSubscriptionId = oldSubscription.data[0].id;

    //create a new subscription with the attached paymentMethod
    const subscription = await stripeClient.subscriptions.create({
        customer: cusId,
        payment_behavior: 'default_incomplete',
        items: [{ price: priceId }],
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
    });

    const paymentIntent = (subscription.latest_invoice as Stripe.Invoice).payment_intent;

    res.send({
        type: 'payment',
        clientSecret: (paymentIntent as Stripe.PaymentIntent).client_secret,
        subscriptionId: subscription.id,
        oldSubscriptionId,
    });

    return res.status(httpCodes.OK).json(subscription);
};

export default ApiHandler({
    postHandler,
});
