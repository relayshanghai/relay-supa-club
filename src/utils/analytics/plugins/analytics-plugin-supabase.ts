import type { AnalyticsPlugin } from 'analytics';
import type { AnalyticsEventParam, TrackedEvent } from '../types';
import { apiFetch } from 'src/utils/api/api-fetch';
import { now } from 'src/utils/datetime';

export type SupabasePluginConfig = any;

type TrackPropertiesType = { event: TrackedEvent, payload?: any }

export const SupabasePlugin = (config: SupabasePluginConfig = {}): AnalyticsPlugin => {
    return {
        name: 'supabase',
        config,
        initializeStart: (_args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            // console.log('initializeStart', args.payload);
        },
        ready: (_args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            // console.log('ready', args.instance.user());
        },
        identifyStart: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('identifyStart', args.payload);
        },
        resetStart: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('resetStart', args.payload);
        },
        trackStart: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('trackStart', args);
        },
        track: async (args: AnalyticsEventParam<TrackPropertiesType>) => {
            // eslint-disable-next-line no-console
            console.log('track', args);

            const { event, payload } = args.payload.properties

            const trigger = async (eventName: string, payload?: any) => {
                return await apiFetch('/api/analytics/tracking', {
                    body: {
                        event: eventName,
                        event_at: now(),
                        payload,
                    }
                })
            }

            return await event(trigger, payload)
        },
    };
};
