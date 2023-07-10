import { getCookie } from 'cookies-next';
import { ANALYTICS_COOKIE_ANON } from '../constants';
import type { TrackedEvent, ServerContext } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getProfileByUser, insertTrackingEvent } from 'src/utils/api/db/calls/tracking_events';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import { getJourney } from 'src/utils/analytics/api/journey';
import { now } from 'src/utils/datetime';

type SessionIds = {
    session_id?: string;
    user_id?: string;
    profile_id?: string;
    company_id?: string | null;
};

export const getAnonId = (ctx: ServerContext) => {
    let cookie = getCookie(ANALYTICS_COOKIE_ANON, ctx);

    if (typeof cookie !== 'string') {
        cookie = String(cookie);
    }

    return cookie;
};

/**
 * Get the current user session from Supabase
 */
export const getUserSession = (db: SupabaseClient) => async () => {
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

/**
 * Return a function that tracks an event
 */
export const createTrack = (ctx: ServerContext) => async (event: TrackedEvent, payload?: any) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const sessionIds = await getUserSession(supabase)();
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
