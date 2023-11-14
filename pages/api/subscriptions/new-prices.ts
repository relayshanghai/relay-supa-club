import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getNewStripePlanPrices } from 'src/utils/api/stripe/new-prices';
import type { NewRelayPlan } from 'types';

export type NewSubscriptionPricesGetResponse = {
    discovery: NewRelayPlan[];
    outreach: NewRelayPlan[];
};

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const prices: NewSubscriptionPricesGetResponse = await getNewStripePlanPrices();
    return res.status(httpCodes.OK).json(prices);
}

export default ApiHandler({
    getHandler,
});
