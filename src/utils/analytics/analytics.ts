import type { AnalyticsInstance } from 'analytics';
import type { TrackedEvent } from './types';

/**
 * Return a function that tracks an event on the frontend
 */
export const createTrack =
    (analytics: AnalyticsInstance) =>
    <T extends TrackedEvent>(event: T, payload?: Parameters<T>[1], options?: { __abort?: AbortController }) =>
        analytics.track(event.eventName, { event, payload, options });
