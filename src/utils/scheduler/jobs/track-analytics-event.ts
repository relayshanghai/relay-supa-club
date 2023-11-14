import { identifyAccount } from 'src/utils/api/email-engine/identify-account';
import type { JobInterface } from '../types';
import { rudderstack } from 'src/utils/rudderstack';
import { initEvent } from 'src/utils/analytics/events';
import { track } from 'src/utils/rudderstack/rudderstack';

export const TrackAnalyticsEvent: JobInterface<'track_analytics_event'> = {
    name: 'track_analytics_event',
    run: async (_payload) => {
        const { account, eventName, payload } = _payload;

        identifyAccount(account);
        const event = initEvent(eventName);

        track(rudderstack.getClient(), rudderstack.getIdentity())(event, payload);

        return _payload;
    },
};
