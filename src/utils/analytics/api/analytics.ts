import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import { hasher } from 'node-object-hash';
import { getJourney } from 'src/utils/analytics/api/journey';
import { getUserSession } from 'src/utils/api/analytics';
import { insertReportSnapshot } from 'src/utils/api/db/calls';
import { getOrInsertSearchParameter } from 'src/utils/api/db/calls/search-parameters';
import { insertSearchSnapshot } from 'src/utils/api/db/calls/search-snapshots';
import { getTrackingEvent, insertTrackingEvent } from 'src/utils/api/db/calls/tracking_events';
import { SearchInfluencersPayload } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { ApiPayload } from 'src/utils/api/types';
import { now } from 'src/utils/datetime';
import { isJson } from 'src/utils/json';
import type { DatabaseWithCustomTypes } from 'types';
import { v4 } from 'uuid';
import { ANALYTICS_HEADER_NAME } from '../constants';
import type { ServerContext, TrackedEvent } from '../types';

export const getAnonId = (ctx: ServerContext) => {
    if (ANALYTICS_HEADER_NAME in ctx.req.headers) {
        const id = ctx.req.headers[ANALYTICS_HEADER_NAME];
        return Array.isArray(id) ? id[0] : id;
    }
};

/**
 * Return a function that tracks an event on the backend
 */
export const createTrack = <T extends TrackedEvent>(ctx: ServerContext) => {
    return async (event: T, payload?: Parameters<typeof event>[1] & { event_id?: string | null }) => {
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
            session_id: sessionIds.session_id,
            user_id: sessionIds.user_id,
            profile_id: sessionIds.profile_id,
            company_id: sessionIds.company_id,
        };

        return await event<typeof trigger>(trigger, eventPayload);
    };
};

export type CreateSearchSnapshotParams = {
    event_id?: string;
    parameters_id: string;
    parameters: any;
    results: any;
};

export type CreateAnalyzeSnapshotParams = {
    event_id?: string;
    parameters: any;
    results: any;
};

export const createSearchSnapshot = async (ctx: ServerContext, payload: CreateSearchSnapshotParams) => {
    // @note logs a TypeError "Cannot set headers.." due to outdated auth-helpers-next package
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const { profile_id, company_id } = await getUserSession(supabase)();

    const { event_id, parameters_id, ...snapshot } = payload;

    const displayed = [
        'accounts.account.fullname',
        'accounts.account.username',
        'accounts.account.followers',
        'accounts.account.engagements',
        'accounts.account.engagement_rate',
        'accounts.account.avg_views',
    ];

    const insertData = {
        event_id,
        profile_id,
        company_id,
        parameters_id,
        snapshot: { ...snapshot, displayed },
    };

    return await insertSearchSnapshot(supabase)(insertData);
};

export const createReportSnapshot = async (ctx: ServerContext, payload: CreateAnalyzeSnapshotParams) => {
    // @note logs a TypeError "Cannot set headers.." due to outdated auth-helpers-next package
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
    const sessionIds = await getUserSession(supabase)();

    const { event_id, ...snapshot } = payload;

    const displayed = [
        'user_profile.fullname',
        'user_profile.url',
        'user_profile.user_id',
        'user_profile.description',
        'user_profile.contacts',
        'user_profile.geo',
        'user_profile.followers',
        'user_profile.total_views',
        'user_profile.avg_views',
        'user_profile.engagements',
        'user_profile.avg_likes',
        'user_profile.avg_comments',
        'user_profile.engagement_rate',
        'user_profile.similar_users',
        'user_profile.stat_history',
        'audience_followers.data.audience_types',
        'audience_followers.data.audience_genders',
        'audience_followers.data.audience_ages',
        'audience_followers.data.audience_locations',
        'audience_followers.data.audience_languages',
        'audience_followers.data.audience_interests',
        'audience_followers.data.audience_geo.countries',
        'audience_followers.data.audience_geo.cities',
        'audience_followers.data.audience_brand_affinity',
        'audience_followers.data.audience_genders_per_age',
        'audience_followers.data.audience_lookalikes',
        'user_profile.top_posts',
        'user_profile.recent_posts',
        'user_profile.commercial_posts',
    ];

    const insertData = {
        event_id,
        profile_id: sessionIds.profile_id,
        company_id: sessionIds.company_id,
        snapshot: { ...snapshot, displayed },
    };

    return await insertReportSnapshot(supabase)(insertData);
};

export const createSearchParameter = (db: SupabaseClient) => async (payload: ApiPayload) => {
    const parsedPayload = SearchInfluencersPayload.passthrough().parse(payload);
    const { path, query, body } = parsedPayload;
    const data = { path, query, body };

    const hash = hasher().hash(parsedPayload);

    if (isJson(data)) {
        return await getOrInsertSearchParameter(db)({ hash, data });
    }

    throw new Error('payload cannot be parsed to JSON');
};
