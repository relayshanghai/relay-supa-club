import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;
        console.log({ id });
        const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
        const { id } = req.query;
        const { data, error } = await supabase
            .from('campaigns')
            .update(req.body)
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(200).json(data);
    }
}
