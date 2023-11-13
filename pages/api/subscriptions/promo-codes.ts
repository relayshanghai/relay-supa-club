import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';

export type PromotionCodesListResponse = Stripe.ApiListPromise<Stripe.PromotionCode>;

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const promoCodes = await stripeClient.promotionCodes.list({ active: true });
    return res.status(httpCodes.OK).json(promoCodes);
}

export default ApiHandler({
    getHandler,
});
