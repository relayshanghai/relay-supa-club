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
import type { TrackedEvent, ctx } from 'src/utils/analytics/types';
import events, { eventKeys } from 'src/utils/analytics/events';

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
    event: eventKeys,
    event_at: z.string().optional().default(now),
    payload: JsonRoot,
});

const createTrack = (ctx: ctx) => async (event: TrackedEvent, payload?: any) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const sessionIds = await getSessionIds(supabase)();
    const journey = getJourney(ctx);
    const anonymous_id = getAnonId(ctx);
    const trigger = (eventName: string, payload?: any) =>
        insertTrackingEvent(supabase)({ ...payload, event: eventName });

    const { event_at, ...otherPayload } = payload;

    const _payload = {
        event_at: event_at ?? now(),
        journey_id: journey ? journey.id : null,
        journey_type: journey ? journey.name : null,
        data: {
            journey,
            ...otherPayload,
        },
        anonymous_id,
        ...sessionIds,
    };

    return await event(trigger, _payload);
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { event, event_at, payload } = PostRequestBody.parse(req.body);

    const result = createTrack({ req, res })(events[event], { ...payload, event_at });

    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({
    postHandler,
});
