import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;
        const { data, error } = await supabase
            .from('companies')
            .select('*, profiles(id, first_name, last_name, admin)')
            .eq('id', companyId)
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

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }

    return res.status(400).json(null);
}
