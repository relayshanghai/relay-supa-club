import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CampaignDB, CampaignDBUpdate, updateCampaign } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

export type CampaignUpdatePostBody = CampaignDBUpdate;
export type CampaignUpdatePostResponse = CampaignDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const data = req.body as CampaignUpdatePostBody;

        const { data: campaign, error } = await updateCampaign(data);

        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }
        return res.status(httpCodes.OK).json(campaign);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
