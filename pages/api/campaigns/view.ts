import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, campaign_id } = JSON.parse(req.body);

        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('company_id', company_id)
            .eq('id', campaign_id);
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(data);
    }
    return res.status(400).end();
}
