import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { updateCampaign } from 'src/utils/api/db';
import type { CampaignDB, CampaignDBUpdate } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';

export interface CampaignUpdatePostBody extends CampaignDBUpdate {
    profile_id: string;
}
export type CampaignUpdatePostResponse = CampaignDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const data = JSON.parse(req.body) as CampaignUpdatePostBody;
        if (!(await checkSessionIdMatchesID(data.profile_id, req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({});
        }

        const { data: campaign, error } = await updateCampaign(data);

        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }
        return res.status(httpCodes.OK).json(campaign);
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
}
