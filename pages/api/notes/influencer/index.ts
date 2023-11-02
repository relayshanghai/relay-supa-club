import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { RelayError } from 'src/errors/relay-error';
import type { ApiRequest, ApiResponse } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { getUserSessionFromServerContext } from 'src/utils/api/analytics';
import { saveNotesBySequenceInfluencer } from 'src/utils/api/db/calls/sequence-influencer-notes';
import { db } from 'src/utils/supabase-client';
import type { DBQueryParameters, DBQueryReturn } from 'src/utils/types';

export type SaveSequenceInfluencerNotesRequest = ApiRequest<{
    body: Omit<DBQueryParameters<typeof saveNotesBySequenceInfluencer>[0], 'user_id'>;
}>;

export type SaveSequenceInfluencerNotesResponse = ApiResponse<DBQueryReturn<typeof saveNotesBySequenceInfluencer>>;

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const body: SaveSequenceInfluencerNotesRequest['body'] = req.body;

    if (!body.sequence_influencer_id) {
        throw new RelayError('Not found', 400);
    }

    const sessionIds = await getUserSessionFromServerContext({ req, res });

    if (!sessionIds.user_id) {
        throw new RelayError('Cannot save notes', 400);
    }

    const notes = await db(saveNotesBySequenceInfluencer)({ ...body, user_id: sessionIds.user_id });

    return res.status(httpCodes.OK).json(notes);
}

export default ApiHandler({
    postHandler,
});
