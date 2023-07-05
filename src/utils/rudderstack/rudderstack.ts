import Analytics from '@rudderstack/rudder-sdk-node';
import type { constructorOptions } from '@rudderstack/rudder-sdk-node';

export type RudderBackend = Analytics;

export type EventParameters<P = any> = P & Omit<Parameters<RudderBackend['track']>[0], 'event'>;

export type RudderIdentifier = {
    userId?: string;
    anonymousId?: string;
};

export const createClient = (writeKey?: string, dataPlane?: string, options?: constructorOptions): RudderBackend =>
    new Analytics(writeKey ?? process.env.RUDDERSTACK_APP_WRITE_KEY ?? '', {
        dataPlaneUrl: dataPlane ?? process.env.RUDDERSTACK_APP_DATA_PLANE_URL,
        ...options,
    });
