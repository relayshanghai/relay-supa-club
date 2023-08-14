import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { saveNotesBySequenceInfluencer } from 'src/utils/api/db/calls/sequence-influencer-notes';
import { db } from 'src/utils/supabase-client';

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;

    if (!body.sequenceInfluencerId && !body.user_id) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Not found' });
    }

    const notes = await db(saveNotesBySequenceInfluencer)(body);

    return res.status(httpCodes.OK).json(notes);
}

export default ApiHandler({
    postHandler,
});
