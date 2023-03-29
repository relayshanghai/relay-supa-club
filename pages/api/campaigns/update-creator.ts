import type { NextApiRequest, NextApiResponse } from 'next';
import type { CampaignCreatorDBUpdate } from 'src/utils/api/db';
import { updateCampaignCreator } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';

export interface CampaignCreatorUpdatePutBody extends CampaignCreatorDBUpdate {
    campaign_id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { campaign_id, ...data } = req.body;
        const { data: campaignCreators, error } = await updateCampaignCreator(data, campaign_id);
        if (error) {
            serverLogger(error, 'error');
            return res.status(500).json(error);
        }
        return res.status(200).json(campaignCreators);
    }

    return res.status(400).json(null);
}
