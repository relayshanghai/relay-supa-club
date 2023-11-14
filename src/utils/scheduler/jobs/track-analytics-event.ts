import { identifyAccount } from 'src/utils/api/email-engine/identify-account';
import type { JobInterface } from '../types';
import { rudderstack } from 'src/utils/rudderstack';
import type events from 'src/utils/analytics/events';
import { initEvent } from 'src/utils/analytics/events';
import { track } from 'src/utils/rudderstack/rudderstack';

type TrackAnalyticsEventPayload = {
    account: string;
    eventName: keyof typeof events;
    /**
     * Too deep to improve dx. Double check payload type in analytics index for now
     */
    eventPayload: any;
};

type TrackAnalyticsEventRun = (payload: TrackAnalyticsEventPayload) => Promise<any>;

export const TrackAnalyticsEvent: JobInterface<'track_analytics_event', TrackAnalyticsEventRun> = {
    name: 'track_analytics_event',
    run: async (payload) => {
        const { account, eventName, eventPayload } = payload;

        identifyAccount(account);

        const event = initEvent(eventName);

        track(rudderstack.getClient(), rudderstack.getIdentity())(event, eventPayload);

        return payload;
    },
};
