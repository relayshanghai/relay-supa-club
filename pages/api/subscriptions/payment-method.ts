import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        const { data, error } = await supabase
            .from('companies')
            .select('cus_id, name')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json(error);
        }
        if (!data || !data.cus_id) {
            return res.status(404).json(null);
        }

        const result = await stripeClient.customers.listPaymentMethods(data.cus_id, {
            type: 'card'
        });

        return res.status(200).json(result);
    }

    return res.status(404).send(null);
}
