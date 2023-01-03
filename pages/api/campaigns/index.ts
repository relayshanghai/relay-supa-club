import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';
import { CampaignWithCompanyCreators } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;
        const { data, error } = await supabase
            .from('campaigns')
            // If this query changes, make sure to update the CampaignWithCompany type
            .select(
                '*, companies(id, name, cus_id), campaign_creators(id, creator_id, username, fullname, avatar_url, link_url)'
            )
            .eq('company_id', companyId);
        if (error) {
            return res.status(500).json(error);
        }
        return res.status(200).json(data as CampaignWithCompanyCreators[]);
    }
    return res.status(400).end();
}
