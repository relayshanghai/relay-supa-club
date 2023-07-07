import type { AnalyticsInstance } from 'analytics';
import { now } from 'src/utils/datetime';

export const SEARCH_OPEN_SOCIAL_PROFILE = 'search-open_social_profile';

export const SearchOpenSocialProfile = (analytics: AnalyticsInstance) => (value?: any) => {
    analytics.track(SEARCH_OPEN_SOCIAL_PROFILE, {
        event: SEARCH_OPEN_SOCIAL_PROFILE,
        event_at: now(),
        payload: {
            ...value,
        },
    });
};
