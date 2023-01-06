import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';
import { stripeClient } from 'src/utils/stripe-client';
import { StripePlanWithPrice } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const [products, plans] = await Promise.all([
                await stripeClient.products.list(),
                await stripeClient.plans.list()
            ]);

            const withPlans: StripePlanWithPrice[] = products.data.map(
                (product: StripePlanWithPrice) => {
                    const prices = plans.data.filter((plan) => plan.product === product.id);
                    product.prices = prices;
                    return product;
                }
            );

            return res.status(httpCodes.OK).json(withPlans);
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'unable to get plans' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
