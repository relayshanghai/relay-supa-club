import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, ...data } = JSON.parse(req.body);
        console.log({ company_id, ...data });
        const { data: campaignCreators, error } = await supabase
            .from('campaign_creators')
            .insert({
                campaign_id: data.id,
                status: 'to contact',
                ...data
            })
            .eq('company_id', company_id)
            .single();

        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        return res.status(200).json(campaignCreators);
    }

    return res.status(400).json(null);
}
