import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/stripe-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const [products, plans] = await Promise.all([
            await stripeClient.products.list(),
            await stripeClient.plans.list()
        ]);

        const withPlans = products.data.map((product: any) => {
            const prices = plans.data.filter((plan: any) => plan.product === product.id);
            product.prices = prices;
            return product;
        });

        return res.status(200).json(withPlans);
    }

    return res.status(400).json(null);
}
