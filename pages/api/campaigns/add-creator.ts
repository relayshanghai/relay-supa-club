import { NextApiRequest, NextApiResponse } from 'next';
import { insertCampaignCreator } from 'src/utils/api/db';

export interface CampaignCreatorAddCreatorPostBody {
    campaign_id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { campaign_id, ...data } = JSON.parse(req.body);

        const { data: campaignCreators, error } = await insertCampaignCreator(data, campaign_id);
        if (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return res.status(500).json(error);
        }
        return res.status(200).json(campaignCreators);
    }

    return res.status(400).json(null);
}
