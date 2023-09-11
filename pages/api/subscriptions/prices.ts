import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import type { RelayPlan } from 'types';
import { getStripePlanPrices } from 'src/utils/api/stripe/prices';

export type SubscriptionPricesGetResponse = {
    diy: RelayPlan;
    diyMax: RelayPlan;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const prices: SubscriptionPricesGetResponse = await getStripePlanPrices();
            return res.status(httpCodes.OK).json(prices);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'unable to get plan prices' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
