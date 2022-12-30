import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, id, ...data } = JSON.parse(req.body);
        const { data: campaign, error } = await supabase
            .from('campaigns')
            .update({
                ...data
            })
            .eq('id', id)
            .eq('company_id', company_id)
            .single();

        if (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return res.status(500).json(error);
        }
        return res.status(200).json(campaign);
    }

    return res.status(400).json(null);
}
