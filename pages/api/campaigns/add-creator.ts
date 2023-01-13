import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CampaignCreatorDB, insertCampaignCreator } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

export interface CampaignCreatorAddCreatorPostBody {
    company_id: string;
}
export type CampaignCreatorAddCreatorPostResponse = CampaignCreatorDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id, ...data } = JSON.parse(req.body);
        const { data: campaignCreators, error } = await insertCampaignCreator(data, company_id);
        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }
        return res.status(httpCodes.OK).json(campaignCreators);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
