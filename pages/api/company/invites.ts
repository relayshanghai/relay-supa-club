import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { company_id } = JSON.parse(req.body);
        const { data, error } = await supabase
            .from('invites')
            .select('*')
            .eq('company_id', company_id);

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
