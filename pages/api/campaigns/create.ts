import { data } from 'autoprefixer';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, name, ...data } = JSON.parse(req.body);
        const { data: campaign, error } = await supabase
            .from('campaigns')
            .insert({
                company_id: company_id,
                name: name,
                ...data,
                status: 'not started'
            })
            .eq('company_id', company_id)
            .single();

        if (error) {
            // console.log(error);
            return res.status(500).json(error);
        }
        return res.status(200).json(campaign);
    }

    return res.status(400).json(null);
}
