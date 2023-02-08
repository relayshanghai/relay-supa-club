import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { CampaignNotesDB, CampaignNotesInsertDB } from 'src/utils/api/db';
import { insertCampaignNote } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

export type CampaignNotePostBody = CampaignNotesInsertDB;
export type CampaignNotePostResponse = CampaignNotesDB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const data = JSON.parse(req.body);
        const { data: CampaignNote, error } = await insertCampaignNote(data);

        if (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
        }

        return res.status(httpCodes.OK).json(CampaignNote);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
