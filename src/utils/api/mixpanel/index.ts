export const MIXPANEL_PROJECT_TOKEN = process.env.MIXPANEL_PROJECT_TOKEN;

import mixpanel from 'mixpanel';

if (!MIXPANEL_PROJECT_TOKEN) {
    throw new Error('Missing MIXPANEL_PROJECT_TOKEN, tracking will be disabled');
}

// Initialize mixpanel client

export const mixpanelClient = mixpanel.init(MIXPANEL_PROJECT_TOKEN);
