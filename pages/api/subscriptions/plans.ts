import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/stripe-client';
import { StripePlansWithPrice } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const [products, plans] = await Promise.all([
            await stripeClient.products.list(),
            await stripeClient.plans.list()
        ]);

        const withPlans: StripePlansWithPrice[] = products.data.map(
            (product: StripePlansWithPrice) => {
                const prices = plans.data.filter((plan) => plan.product === product.id);
                product.prices = prices;
                return product;
            }
        );

        return res.status(200).json(withPlans);
    }

    return res.status(400).json(null);
}
