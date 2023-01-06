import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';
import { CampaignCreatorDB } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { campaign_id, ...data } = JSON.parse(req.body);
        const { data: campaignCreators, error } = await supabase
            .from<CampaignCreatorDB>('campaign_creators')
            .update({ ...data })
            .eq('id', data.id)
            .eq('campaign_id', campaign_id);

        if (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return res.status(500).json(error);
        }
        return res.status(200).json(campaignCreators);
    }

    return res.status(400).json(null);
}
