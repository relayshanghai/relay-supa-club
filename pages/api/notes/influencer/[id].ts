import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getNotesBySequenceInfluencer } from 'src/utils/api/db/calls/sequence-influencer-notes';
import { db } from 'src/utils/supabase-client';

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const sequenceInfluencerId = req.query.id;

    // @todo this is usually fetched from the session
    const user_id = req.query.author;

    if (!sequenceInfluencerId && !user_id) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Not found' });
    }

    const notes = await db(getNotesBySequenceInfluencer)(sequenceInfluencerId, { user_id });

    return res.status(httpCodes.OK).json(notes);
}

export default ApiHandler({
    getHandler,
});
