export const MIXPANEL_PROJECT_TOKEN = process.env.MIXPANEL_PROJECT_TOKEN;

import mixpanel from 'mixpanel';
import { isDev } from 'src/constants';

export const mixpanelClient = () => {
    if (!MIXPANEL_PROJECT_TOKEN || isDev()) {
        return null;
    }
    return mixpanel.init(MIXPANEL_PROJECT_TOKEN);
};
