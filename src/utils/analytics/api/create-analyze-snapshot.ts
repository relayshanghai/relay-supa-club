import type { AnalyzePayload } from './../events/analyze';
import { getAnonId, getUserSession } from './analytics';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { insertSnapshot } from 'src/utils/api/db/calls';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext, TrackedEvent, TriggerEvent } from '../types';
import { insertTrackingEvent } from 'src/utils/api/db/calls/tracking_events';
import { getJourney } from 'src/utils/analytics/api/journey';
import { now } from 'src/utils/datetime';
import { Analyze } from '../events';

export type CreateAnalyzeSnapshotParams = {
    /**
     * Analyze parameters for this snapshot
     */
    parameters: any;
    /**
     * Analyze results for this snapshot
     */
    results: any;
};

const trackSnapshotEvent = async (triggerTrack: TriggerEvent<AnalyzePayload>, trackingPayload: AnalyzePayload) => {
    await Analyze(triggerTrack, trackingPayload);
};
export const createAnalyzeSnapshot = <T extends TrackedEvent>(ctx: ServerContext) => {
    return async (snapshotEvent: T, payload?: Parameters<T>[1]) => {
        const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(ctx);
        const sessionIds = await getUserSession(supabase)();
        const journey = getJourney(ctx);
        const anonymous_id = getAnonId(ctx);

        //Defining triggers for updating both snapshot and tracking_event tables
        const triggerSnapshot = (eventName: string, payload?: any) =>
            insertSnapshot(supabase)({ ...payload, event: eventName });

        const triggerTrack = (eventName: string, payload?: any) =>
            insertTrackingEvent(supabase)({ ...payload, event: eventName });

        if (payload === undefined) {
            payload = {};
        }

        const { event_at, ..._payload } = payload;

        // Defining payloads
        const trackingPayload = {
            event_at: event_at ?? now(),
            journey_id: journey ? journey.id : null,
            journey_type: journey ? journey.name : null,
            data: {
                journey,
            },
            anonymous_id,
            ...sessionIds,
        };

        const snapshotPayload = {
            created_at: event_at ?? now(),
            data: {
                ...payload,
            },
        };

        await trackSnapshotEvent(triggerTrack, trackingPayload);

        return await snapshotEvent(triggerSnapshot, snapshotPayload);
    };
};
