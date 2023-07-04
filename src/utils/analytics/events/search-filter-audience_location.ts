import type { AnalyticsInstance } from 'analytics';

export const SearchFilterAudienceLocationUsed = (analytics: AnalyticsInstance) => (value: any) => {
    analytics.track('search.filter.audience_location:used', { value });
};
