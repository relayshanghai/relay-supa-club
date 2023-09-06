import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getNewStripePlanPrices } from 'src/utils/api/stripe/new-prices';
import { serverLogger } from 'src/utils/logger-server';
import type { NewRelayPlan } from 'types';

export type NewSubscriptionPricesGetResponse = {
    discovery: NewRelayPlan;
    outreach: NewRelayPlan;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const prices: NewSubscriptionPricesGetResponse = await getNewStripePlanPrices();
            return res.status(httpCodes.OK).json(prices);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'unable to get plan prices' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
