import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';
import { CampaignWithCompanyCreators } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        //updateCampaign can only update the campaign table, not the campaign_creators table and company table, so extracted the campaign_creators and companies from the req.body
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, campaign_creators, companies, ...data } = JSON.parse(req.body);
        const { data: campaign, error } = await supabase
            .from<CampaignWithCompanyCreators>('campaigns')
            .update({
                ...data
            })
            .eq('id', id)
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
