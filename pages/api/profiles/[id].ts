import type { NextApiHandler } from 'next';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import { getUserSessionFromServerContext } from 'src/utils/api/analytics';
import type { ProfileDB, ProfileDBUpdate } from 'src/utils/api/db';
import { incrementTotalLogin } from 'src/utils/api/db/calls/profiles';
import type { ApiPayload } from 'src/utils/api/types';
import { db } from 'src/utils/supabase-client';

export type ProfileUpdateRequest = ApiPayload<{ id: string }, undefined, { data: ProfileDBUpdate }>;

export type ProfileUpdateResponse = { data: ProfileDB | null };

const postHandler: NextApiHandler<ProfileUpdateResponse> = async (req, res) => {
    const session = await getUserSessionFromServerContext({ req, res });

    const profileId = req.query.id;
    const body = req.body as ProfileUpdateRequest['body'];

    if (!body || !session.profile_id || profileId !== session.profile_id) {
        throw new RelayError('Not found', 404);
    }

    if (body.data.total_sessions) {
        const updatedProfile = await db(incrementTotalLogin)(session.profile_id, body.data.total_sessions);
        return res.json({ data: updatedProfile });
    }

    return res.json({ data: null });
};

export default ApiHandler({
    postHandler,
});
