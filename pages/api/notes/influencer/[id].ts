import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { ApiError } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { getUserSession } from 'src/utils/api/analytics';
import { getNotesBySequenceInfluencer } from 'src/utils/api/db/calls/sequence-influencer-notes';
import { db } from 'src/utils/supabase-client';
import type { DBQueryReturn } from 'src/utils/types';

export type ApiResponse = DBQueryReturn<typeof getNotesBySequenceInfluencer> | ApiError;

export async function getHandler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const sequenceInfluencerId = req.query.id as string;
    const filters: { [key: string]: any } = {};

    if (req.query.current_user_only) {
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
