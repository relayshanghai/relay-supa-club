import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { ApiResponse } from 'src/utils/api-handler';
import { ApiHandler, createApiRequest } from 'src/utils/api-handler';
import { getUserSession } from 'src/utils/api/analytics';
import { getNotesBySequenceInfluencer } from 'src/utils/api/db/calls/sequence-influencer-notes';
import { db } from 'src/utils/supabase-client';
import type { DBQueryReturn } from 'src/utils/types';
import { boolish } from 'src/utils/zod';
import { z } from 'zod';

export const GetSequenceInfluencerNotesRequest = createApiRequest({
    path: z.object({ id: z.string() }),
    query: z.object({ current_user_only: boolish() }),
});

export type GetSequenceInfluencerNotesRequest = z.input<typeof GetSequenceInfluencerNotesRequest>;

export type GetSequenceInfluencerNotesResponse = ApiResponse<DBQueryReturn<typeof getNotesBySequenceInfluencer>>;

export async function getHandler(req: NextApiRequest, res: NextApiResponse<GetSequenceInfluencerNotesResponse>) {
    const payload = GetSequenceInfluencerNotesRequest.parse({
        path: { id: req.query.id },
        query: { current_user_only: req.query.current_user_only },
    });

    const sequenceInfluencerId = payload.path.id;
    const filters: { user_id?: string } = {};

    if (payload.query.current_user_only) {
        const sessionIds = await getUserSession(createServerSupabaseClient({ req, res }))();
        filters.user_id = sessionIds.user_id;
    }

    if (!sequenceInfluencerId) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Not found' });
    }

    const notes = await db(getNotesBySequenceInfluencer)(sequenceInfluencerId, filters);

    return res.status(httpCodes.OK).json(notes);
}

export default ApiHandler({
    getHandler,
});
