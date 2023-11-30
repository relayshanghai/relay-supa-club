export const MIXPANEL_PROJECT_TOKEN = process.env.MIXPANEL_PROJECT_TOKEN;

import mixpanel from 'mixpanel';

export const mixpanelClient = mixpanel.init(MIXPANEL_PROJECT_TOKEN as string);
