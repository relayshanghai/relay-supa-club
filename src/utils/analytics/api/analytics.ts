import type { ServerContext, TrackedEvent } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getProfileByUser, getTrackingEvent, insertTrackingEvent } from 'src/utils/api/db/calls/tracking_events';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import { getJourney } from 'src/utils/analytics/api/journey';
import { now } from 'src/utils/datetime';
import { insertSearchSnapshot } from 'src/utils/api/db/calls/search_snapshots';
import { insertReportSnapshot } from 'src/utils/api/db/calls';
import { v4 } from 'uuid';
import { ANALYTICS_HEADER_NAME } from '../constants';

type SessionIds = {
    session_id?: string;
    user_id?: string;
    profile_id?: string;
    company_id?: string | null;
};

export const getAnonId = (ctx: ServerContext) => {
    if (ANALYTICS_HEADER_NAME in ctx.req.headers) {
        const id = ctx.req.headers[ANALYTICS_HEADER_NAME];
        return Array.isArray(id) ? id[0] : id;
    }
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
        // @todo profile.id is user.id
        data.profile_id = profile.id;
        data.company_id = profile.company_id;
    }

    return data;
};

/**
 * Return a function that tracks an event on the backend
 */
export const createTrack = <T extends TrackedEvent>(ctx: ServerContext) => {
    return async (event: T, payload?: Parameters<typeof event>[1]) => {
        // @note logs a TypeError "Cannot set headers.." due to outdated auth-helpers-next package
        const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
        const sessionIds = await getUserSession(supabase)();
        const journey = getJourney(ctx);
        const anonymous_id = getAnonId(ctx);

        if (payload === undefined) {
            payload = {};
        }

        const { event_id, event_at, ..._payload } = payload;

        const _insertTrackingEvent = insertTrackingEvent(supabase);
        const _getTrackingEvent = getTrackingEvent(supabase);
        type TriggerPayload = Omit<Parameters<typeof _insertTrackingEvent>[0], 'id' | 'event'>;

        const trigger = async (eventName: string, payload?: TriggerPayload) => {
            const trackingEvent = event_id ? await _getTrackingEvent(event_id) : null;
            let data: Parameters<typeof _insertTrackingEvent>[0] = { ...payload, event: eventName };

            if (!trackingEvent && event_id) {
                data.id = event_id;
            }

            if (trackingEvent) {
                const newId = v4();
                data = { ...data, id: newId };

                // @note remind us that this event is a copy
                // @ts-ignore suppress Supabase's Json type
                data.data.event_copy_id = event_id;
            }

            return await _insertTrackingEvent(data);
        };

        const eventPayload = {
            event_at: event_at ?? now(),
            journey_id: journey ? journey.id : null,
            journey_type: journey ? journey.name : null,
            data: {
                journey,
                ..._payload,
            },
            anonymous_id,
            ...sessionIds,
        };

        return await event<typeof trigger>(trigger, eventPayload);
    };
};

export type CreateSearchSnapshotParams = {
    event_id?: string;
    payload: {
        parameters: any;
        results: any;
    };
};

export type CreateAnalyzeSnapshotParams = {
    event_id?: string;
    payload: {
        parameters: any;
        results: any;
    };
};

export const createSearchSnapshot = async (ctx: ServerContext, payload: CreateSearchSnapshotParams) => {
    // @note logs a TypeError "Cannot set headers.." due to outdated auth-helpers-next package
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const { profile_id, company_id } = await getUserSession(supabase)();

    const { event_id, ...snapshot } = payload;

    const insertData = {
        event_id,
        profile_id,
        company_id,
        snapshot,
    };

    return await insertSearchSnapshot(supabase)(insertData);
};

export const createReportSnapshot = async (ctx: ServerContext, payload: CreateAnalyzeSnapshotParams) => {
    // @note logs a TypeError "Cannot set headers.." due to outdated auth-helpers-next package
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const sessionIds = await getUserSession(supabase)();

    const { event_id, ...snapshot } = payload;

    const insertData = {
        event_id,
        profile_id: sessionIds.profile_id,
        company_id: sessionIds.company_id,
        snapshot,
    };

    return await insertReportSnapshot(supabase)(insertData);
};
