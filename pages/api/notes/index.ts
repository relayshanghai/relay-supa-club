import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { CampaignNotesWithProfiles } from 'src/utils/api/db';
import { getCampaignNotes } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';

export type CampaignNotesIndexGetQuery = {
    id: string;
};

export type CampaignNotesIndexGetResult = CampaignNotesWithProfiles[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const { id: campaignCreatorId } = req.query as CampaignNotesIndexGetQuery;
        if (!campaignCreatorId) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing creator id' });
        }
        const data = await getCampaignNotes(campaignCreatorId);
        const result: CampaignNotesIndexGetResult = data;
        return res.status(httpCodes.OK).json(result);
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
}
