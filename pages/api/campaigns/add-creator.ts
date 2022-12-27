import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, name, ...data } = JSON.parse(req.body);
        console.log({ company_id, name, ...data });
        // const { data: campaignCreators, error } = await supabase.from('campaign_creators');
        // .insert({
        //     campaign_ig: data.id,
        //     ...data,
        //     status: 'to contact',
        // })
        // .eq('company_id', company_id)
        // .single();

        // if (error) {
        //     console.log(error);
        //     return res.status(500).json(error);
        // }
        // return res.status(200).json(campaignCreators);
    }

    return res.status(400).json(null);
}
