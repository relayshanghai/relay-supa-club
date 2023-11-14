import { identifyAccount } from 'src/utils/api/email-engine/identify-account';
import type { JobInterface } from '../types';
import { rudderstack } from 'src/utils/rudderstack';
import { initEvent } from 'src/utils/analytics/events';
import { track } from 'src/utils/rudderstack/rudderstack';

export const AnalyticsTrackingEvent: JobInterface<'analytics_tracking_event'> = {
    name: 'analytics_tracking_event',
    run: async (_payload) => {
        const { account, eventName, payload } = _payload;

        throw new Error('No account');

        identifyAccount(account);
        const event = initEvent(eventName);

        track(rudderstack.getClient(), rudderstack.getIdentity())(event, payload);

        return _payload;
    },
};
