import type { AnalyticsInstance } from 'analytics';
import type { TrackedEvent } from './types';

/**
 * Return a function that tracks an event on the frontend
 */
export const createTrack = (analytics: AnalyticsInstance) => (event: TrackedEvent, payload?: any) =>
    analytics.track(event.eventName, { event, payload });
