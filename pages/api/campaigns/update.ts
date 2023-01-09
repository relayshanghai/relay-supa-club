import { NextApiRequest, NextApiResponse } from 'next';
import { CampaignDBUpdate, updateCampaign } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

export type CampaignUpdatePostBody = CampaignDBUpdate;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const data = JSON.parse(req.body) as CampaignUpdatePostBody;

        const { data: campaign, error } = await updateCampaign(data);

        if (error) {
            serverLogger(error, 'error');
            return res.status(500).json(error);
        }
        return res.status(200).json(campaign);
    }

    return res.status(400).json(null);
}
