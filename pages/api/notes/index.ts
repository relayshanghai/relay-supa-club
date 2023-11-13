import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { CampaignNotesWithProfiles } from 'src/utils/api/db';
import { getCampaignNotes } from 'src/utils/api/db';

export type CampaignNotesIndexGetQuery = {
    id: string;
};

export type CampaignNotesIndexGetResult = CampaignNotesWithProfiles[];

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { id: campaignCreatorId } = req.query as CampaignNotesIndexGetQuery;
    if (!campaignCreatorId) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing creator id' });
    }
    const data = await getCampaignNotes(campaignCreatorId);
    const result: CampaignNotesIndexGetResult = data;
    return res.status(httpCodes.OK).json(result);
}

export default ApiHandler({
    getHandler,
});
