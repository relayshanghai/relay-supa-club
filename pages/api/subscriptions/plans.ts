import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('plans').select('*').neq('has_trial', true);

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
