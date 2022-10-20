import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*, plans(id, name, value, amount)')
            .eq('company_id', companyId)
            .eq('active', true)
            .maybeSingle();

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
