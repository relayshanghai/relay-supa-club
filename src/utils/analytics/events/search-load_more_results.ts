import type { AnalyticsInstance } from 'analytics';
import { now } from 'src/utils/datetime';

export const SEARCH_LOAD_MORE_RESULTS = 'search-load_more_results';

export const SearchLoadMoreResults = (analytics: AnalyticsInstance) => (value?: any) => {
    analytics.track(SEARCH_LOAD_MORE_RESULTS, {
        event: SEARCH_LOAD_MORE_RESULTS,
        event_at: now(),
        payload: {
            ...value,
        },
    });
};
