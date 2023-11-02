import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { CampaignNotesDB, CampaignNotesInsertDB } from 'src/utils/api/db';
import { insertCampaignNote } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';

export type CampaignNotePostBody = CampaignNotesInsertDB;
export type CampaignNotePostResponse = CampaignNotesDB;

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const data = req.body;
    const { data: campaignNote, error } = await insertCampaignNote(data);

    if (error) {
        serverLogger(error);
    }

    return res.status(httpCodes.OK).json(campaignNote);
}

export default ApiHandler({
    postHandler,
});
