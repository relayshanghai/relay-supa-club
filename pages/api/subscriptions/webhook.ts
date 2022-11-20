import { NextApiRequest, NextApiResponse } from 'next';
import { searchSubscription } from 'src/utils/api/subscription/search';
import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const sig = req.headers['stripe-signature'];

        if (sig) {
            const body = req.body;

            if (body.type === 'customer.subscription.updated') {
                const plan = await stripeClient.products.retrieve(body.data.object.plan.product);

                const { error } = await supabase
                    .from('companies')
                    .update({
                        usage_limit: plan.metadata.usage_limit
                    })
                    .eq('cus_id', body.data.object.customer)
                    .single();

                if (error) {
                    return res.status(400).json(error);
                }
            }

            return res.status(200).json(null);
        }

        return res.status(400).json(null);
    }

    return res.status(400).json(null);
}
