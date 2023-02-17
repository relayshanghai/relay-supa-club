import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { updateCampaignCreator } from 'src/utils/api/db';
import type { CampaignCreatorDBUpdate } from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';

export interface CampaignCreatorUpdatePutBody extends CampaignCreatorDBUpdate {
    campaign_id: string;
    profile_id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const { campaign_id, profile_id, ...data } = JSON.parse(req.body);

        if (!(await checkSessionIdMatchesID(profile_id, req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({});
        }

        const { data: campaignCreators, error } = await updateCampaignCreator(data, campaign_id);
        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
        return res.status(httpCodes.OK).json(campaignCreators);
    } catch (error) {}
}
