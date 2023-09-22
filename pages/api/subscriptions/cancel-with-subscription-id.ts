import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';

export type SubscriptionCancelPostRequestBody = {
    subscriptionId: string;
};

export type SubscriptionCancelPostResponseBody = Stripe.Subscription;

const postHandler = async (req: NextApiRequest, res: NextApiResponse<SubscriptionCancelPostResponseBody>) => {
    const { subscriptionId } = req.body as SubscriptionCancelPostRequestBody;
    const subscription = await stripeClient.subscriptions.cancel(subscriptionId);

    return res.status(httpCodes.OK).json(subscription);
};
export default ApiHandler({
    postHandler,
});
