import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { DatabaseWithCustomTypes } from 'types';
import { getProfileByUser, insertTrackingEvent } from 'src/utils/api/db/calls/tracking_events';
import { getJourney } from 'src/utils/analytics/api/journey';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';
import { now } from 'src/utils/datetime';
import { getAnonId } from 'src/utils/analytics/api/analytics';
import { JsonRoot } from 'src/utils/json';

type SessionIds = {
    session_id?: string;
    user_id?: string;
    profile_id?: string;
    company_id?: string | null;
};

const getSessionIds = (db: SupabaseClient) => async () => {
    const {
        data: { session },
        error: _error_session,
    } = await db.auth.getSession();

    const data: SessionIds = {};

    if (session !== null) {
        const profile = await getProfileByUser(db)(session.user);

        // @ts-ignore session.user.session_id is not included in the User type
        data.session_id = session.user.session_id;
        data.user_id = session.user.id;
        data.profile_id = profile.id;
        data.company_id = profile.company_id;
    }

    return data;
};

const PostRequestBody = z.object({
    event: z.string(),
    event_at: z.string().optional().default(now),
    payload: JsonRoot,
});

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>({ req, res });
    const sessionIds = await getSessionIds(supabase)();
    const journey = getJourney({ req, res });

    const journey_id = journey ? journey.id : null;
    const journey_type = journey ? journey.name : null;

    const anonymous_id = getAnonId({ req, res });

    const { event, event_at, payload } = PostRequestBody.parse(req.body);

    const _insertTrackingEvent = insertTrackingEvent(supabase);

    const result = await _insertTrackingEvent({
        event,
        event_at,
        journey_id,
        journey_type,
        data: {
            journey,
            ...payload,
        },
        anonymous_id,
        ...sessionIds,
    });

    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({
    postHandler,
});
