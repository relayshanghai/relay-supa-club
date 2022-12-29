import { NextApiRequest, NextApiResponse } from 'next';

import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;

        try {
            const { data, error } = await supabase
                .from('companies')
                .select('cus_id')
                .eq('id', companyId)
                .single();

            if (error || !data) throw error;

            const subscriptions = await stripeClient.subscriptions.list({
                customer: data.cus_id,
                status: 'active'
            });
            const subscription = subscriptions.data[0];
            //TODO: handle errors better
            if (!subscription) return res.status(200).json(null);
            const product = await stripeClient.products.retrieve(
                // TODO: fix this, investigate what we are really getting/sending, and make custom type for frontend to receive.
                (subscription as any).plan.product
            );
            (subscription as any).product = product;

            return res.status(200).json(subscription);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return res.status(400).json({ error: 'unable to get subscription' });
        }
    }

    return res.status(400).json(null);
}
