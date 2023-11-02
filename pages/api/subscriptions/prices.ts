import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { RelayPlan } from 'types';
import { getStripePlanPrices } from 'src/utils/api/stripe/prices';
import { ApiHandler } from 'src/utils/api-handler';

export type SubscriptionPricesGetResponse = {
    diy: RelayPlan;
    diyMax: RelayPlan;
};

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const prices: SubscriptionPricesGetResponse = await getStripePlanPrices();
    return res.status(httpCodes.OK).json(prices);
}

export default ApiHandler({
    getHandler,
});
