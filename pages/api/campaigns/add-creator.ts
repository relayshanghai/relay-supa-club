import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';
import { CampaignCreatorDBInsert } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { ...data } = JSON.parse(req.body);
        const { data: campaignCreators, error } = await supabase
            .from<CampaignCreatorDBInsert>('campaign_creators')
            .insert({
                campaign_id: data.id,
                status: 'to contact',
                ...data
            })
            .eq('campaign_id', data.id)
            .single();

        if (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return res.status(500).json(error);
        }
        return res.status(200).json(campaignCreators);
    }

    return res.status(400).json(null);
}
