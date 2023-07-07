import { z } from 'zod';
import { SEARCH, Search } from './search';
import { SEARCH_ANALYZE_INFLUENCER, SearchAnalyzeInfluencer } from './search-analyze-influencer';
import { SEARCH_LOAD_MORE_RESULTS, SearchLoadMoreResults } from './search-load_more_results';
import { SEARCH_OPEN_SOCIAL_PROFILE, SearchOpenSocialProfile } from './search-open_social_profile';

export { Search, SearchLoadMoreResults, SearchAnalyzeInfluencer, SearchOpenSocialProfile };

export const events = {
    [SEARCH]: Search,
    [SEARCH_LOAD_MORE_RESULTS]: SearchLoadMoreResults,
    [SEARCH_ANALYZE_INFLUENCER]: SearchAnalyzeInfluencer,
    [SEARCH_OPEN_SOCIAL_PROFILE]: SearchOpenSocialProfile,
};

export const eventKeys = z.union([
    z.literal(SEARCH),
    z.literal(SEARCH_LOAD_MORE_RESULTS),
    z.literal(SEARCH_ANALYZE_INFLUENCER),
    z.literal(SEARCH_OPEN_SOCIAL_PROFILE),
]);

export type eventKeys = z.infer<typeof eventKeys>;

export default events;
