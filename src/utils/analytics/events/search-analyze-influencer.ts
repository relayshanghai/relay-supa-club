import type { AnalyticsInstance } from 'analytics';
import { now } from 'src/utils/datetime';

export const SEARCH_ANALYZE_INFLUENCER = 'search-analyze_influencer';

export const SearchAnalyzeInfluencer = (analytics: AnalyticsInstance) => (value?: any) => {
    analytics.track(SEARCH_ANALYZE_INFLUENCER, {
        event: SEARCH_ANALYZE_INFLUENCER,
        event_at: now(),
        payload: {
            ...value,
        },
    });
};
