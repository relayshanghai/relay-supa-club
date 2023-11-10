import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const coupons = await stripeClient.coupons.list();
    return res.status(httpCodes.OK).json(coupons);
}

export default ApiHandler({
    getHandler,
});
