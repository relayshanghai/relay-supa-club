import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import {
    CampaignCreatorDB,
    CampaignCreatorDBInsert,
    insertCampaignCreator,
} from 'src/utils/api/db';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger';
import { CreatorPlatform } from 'types';

export interface CampaignCreatorAddCreatorPostBody extends CampaignCreatorDBInsert {
    campaign_id: string;
    added_by_id: string;
    platform: CreatorPlatform;
}
export type CampaignCreatorAddCreatorPostResponse = CampaignCreatorDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const data = JSON.parse(req.body);
        if (!data.campaign_id) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'No campaign id provided' });
        }
        if (!(await checkSessionIdMatchesID(data.added_by_id, req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({});
        }
        const { data: campaignCreators, error } = await insertCampaignCreator(data);
        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }
        return res.status(httpCodes.OK).json(campaignCreators);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}
