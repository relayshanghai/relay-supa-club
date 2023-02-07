import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { CampaignNotesDB, getCampaignNotes } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

export type CampaignNotesIndexGetQuery = {
    id: string;
};

export type CampaignNotesIndexGetResult = CampaignNotesDB[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { id: campaignCreatorId } = req.query as CampaignNotesIndexGetQuery;
            const data = await getCampaignNotes(campaignCreatorId);
            return res.status(httpCodes.OK).json(data);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
