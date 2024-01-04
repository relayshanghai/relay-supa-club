import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';

export type SetupIntentsGetQueries = {
    customerId: string;
};
export type SetupIntentGetResponse = Stripe.Response<Stripe.ApiList<Stripe.SetupIntent>>;
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const cusId = req.query.cusId;

    if (!cusId || typeof cusId !== 'string') {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing cusId' });
    }
    const setupIntents = await stripeClient.setupIntents.list({ customer: cusId });

    if (!setupIntents) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: `Coupon not find setupIntents for ${cusId}` });
    }
    const returnData: SetupIntentGetResponse = setupIntents;
    return res.status(httpCodes.OK).json(returnData);
}
export default ApiHandler({
    getHandler,
});
