import type { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import httpCodes from 'src/constants/httpCodes';
import type Stripe from 'stripe';
import { ApiHandler } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';

export type SubscriptionUpgradeWithAlipayPostRequestBody = {
    companyId: string;
    cusId: string;
    priceId: string;
    couponId?: string;
};

export interface SubscriptionUpgradeWithAlipayPostResponse {
    paymentIntent: Stripe.PaymentIntent;
    oldSubscriptionId: string;
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { cusId, priceId, couponId } = req.body as SubscriptionUpgradeWithAlipayPostRequestBody;
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
    const oldSubscriptionId = oldSubscription.data[0].id;

    // create a new subscription with the attached paymentMethod
    const subscription = await stripeClient.subscriptions.create({
        customer: cusId,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent'],
        off_session: true,
        coupon: couponId,
    });

    const paymentIntent = (subscription.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent;
    if (!paymentIntent) {
        serverLogger('Failed to get payment intent');
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Failed to get payment intent' });
    }
    const response: SubscriptionUpgradeWithAlipayPostResponse = { paymentIntent, oldSubscriptionId };

    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({
    postHandler,
});
