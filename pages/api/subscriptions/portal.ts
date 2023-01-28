import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        const { data, error } = await supabase
            .from('companies')
            .select('cus_id, name, id')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json(error);
        }
        if (!data.cus_id) return res.status(404).send({ message: 'No customer found' });
        const portal = await stripeClient.billingPortal.sessions.create({
            customer: data.cus_id,
            return_url: 'http://localhost:3000/account',
        });

        return res.redirect(307, portal.url);
    }

    return res.status(404).send(null);
}
