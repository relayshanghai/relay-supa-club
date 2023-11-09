import { getItem } from '@analytics/storage-utils';
import type { AnalyticsPlugin } from 'analytics';
import { apiFetch } from 'src/utils/api/api-fetch';
import { now } from 'src/utils/datetime';
import { ANALYTICS_COOKIE_ANON, ANALYTICS_HEADER_NAME } from '../constants';
import type { AnalyticsEventParam, TrackedEvent, TriggerEvent } from '../types';

export type SupabasePluginConfig = any;

type TrackPropertiesType = { event: TrackedEvent; payload?: any; options?: { __abort?: AbortController } };

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
        identifyStart: (_args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            // console.log('identifyStart', args.payload);
        },
        resetStart: (args: AnalyticsEventParam) => {
            // eslint-disable-next-line no-console
            console.log('resetStart', args.payload);
        },
        track: async (args: AnalyticsEventParam<TrackPropertiesType>) => {
            const { event, payload, options } = args.payload.properties;

            const anonymous_id = getItem(ANALYTICS_COOKIE_ANON);

            const trigger: TriggerEvent = async (eventName, payload) => {
                return await apiFetch(
                    '/api/analytics/tracking',
                    {
                        body: {
                            event: eventName,
                            event_at: now(),
                            payload,
                        },
                    },
                    {
                        headers: {
                            [ANALYTICS_HEADER_NAME]: anonymous_id,
                        },
                        signal: options && options.__abort ? options.__abort.signal : undefined,
                    },
                ).catch((error) => {
                    if (error instanceof Error && error.name === 'AbortError') return;
                    throw error;
                });
            };

            return await event(trigger, payload);
        },
    };
};
