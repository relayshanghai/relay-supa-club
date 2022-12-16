import { NextApiRequest, NextApiResponse } from 'next';

import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;

        try {
            const { data } = await supabase
                .from('companies')
                .select('cus_id')
                .eq('id', companyId)
                .single();

            const subscriptions = await stripeClient.subscriptions.list({
                customer: data.cus_id,
                status: 'active'
            });
            const subscription = subscriptions.data[0];
            const product = await stripeClient.products.retrieve(
                (subscription as any).plan.product
            );
            (subscription as any).product = product;

            return res.status(200).json(subscription);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: 'unable to get subscription' });
        }
    }

    return res.status(400).json(null);
}
