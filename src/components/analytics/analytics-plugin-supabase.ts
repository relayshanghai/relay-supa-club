import type { AnalyticsPlugin } from 'analytics';
import type { AnalyticsEventParam, SupabasePluginConfig } from './types';

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
    };
};
