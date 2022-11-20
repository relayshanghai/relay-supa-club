import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from 'src/utils/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;
        const { data, error } = await supabase
            .from('companies')
            .select(
                '*, profiles(id, first_name, last_name, admin), invites(id, email, used), usages(id)'
            )
            .eq('id', companyId)
            .eq('invites.used', false)
            .single();

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { id, ...rest } = JSON.parse(req.body);
        const { data, error } = await supabase
            .from('companies')
            .update({
                ...rest
            })
            .eq('id', id)
            .single();

        await stripeClient.customers.update(data.cus_id, {
            name: data.name,
            description: data.website,
            metadata: {
                company_id: id
            }
        });

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
