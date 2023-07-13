import { z } from 'zod';
import { SEARCH as SEARCH_KEY, Search } from './search';
import { REPORT as REPORT_KEY, Report } from './report';
import { SEARCH_ANALYZE_INFLUENCER, SearchAnalyzeInfluencer } from './search-analyze-influencer';
import { SEARCH_LOAD_MORE_RESULTS, SearchLoadMoreResults } from './search-load_more_results';
import { SEARCH_OPEN_SOCIAL_PROFILE, SearchOpenSocialProfile } from './search-open_social_profile';
import { SEARCH_ADD_TO_CAMPAIGN, SearchAddToCampaign } from './search-add_to_campaign';
import { ANALYZE_ADD_TO_CAMPAIGN, AnalyzeAddToCampaign } from './analyze-add_to_campaign';
import { ANALYZE_OPEN_SOCIAL_PROFILE, AnalyzeOpenSocialProfile } from './analyze-open_social_profile';

export {
    Search,
    Report,
    SearchLoadMoreResults,
    SearchAddToCampaign,
    AnalyzeAddToCampaign,
    SearchAnalyzeInfluencer,
    SearchOpenSocialProfile,
    AnalyzeOpenSocialProfile,
};

export const events = {
    [SEARCH_KEY]: Search,
    [REPORT_KEY]: Report,
    [SEARCH_LOAD_MORE_RESULTS]: SearchLoadMoreResults,
    [SEARCH_ANALYZE_INFLUENCER]: SearchAnalyzeInfluencer,
    [SEARCH_OPEN_SOCIAL_PROFILE]: SearchOpenSocialProfile,
    [SEARCH_ADD_TO_CAMPAIGN]: SearchAddToCampaign,
    [ANALYZE_ADD_TO_CAMPAIGN]: AnalyzeAddToCampaign,
    [ANALYZE_OPEN_SOCIAL_PROFILE]: AnalyzeOpenSocialProfile,
};

export const eventKeys = z.union([
    z.literal(SEARCH_KEY),
    z.literal(REPORT_KEY),
    z.literal(SEARCH_LOAD_MORE_RESULTS),
    z.literal(SEARCH_ANALYZE_INFLUENCER),
    z.literal(SEARCH_OPEN_SOCIAL_PROFILE),
    z.literal(SEARCH_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_OPEN_SOCIAL_PROFILE),
]);

export type eventKeys = z.infer<typeof eventKeys>;

export default events;
