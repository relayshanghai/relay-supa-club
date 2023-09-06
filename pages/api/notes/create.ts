import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { CampaignNotesDB, CampaignNotesInsertDB } from 'src/utils/api/db';
import { insertCampaignNote } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';

export type CampaignNotePostBody = CampaignNotesInsertDB;
export type CampaignNotePostResponse = CampaignNotesDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    const data = req.body;
    const { data: campaignNote, error } = await insertCampaignNote(data);

    if (error) {
        serverLogger(error);
    }

    return res.status(httpCodes.OK).json(campaignNote);
}
