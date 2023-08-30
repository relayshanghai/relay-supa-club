import { z } from 'zod';
import { ANALYZE_ADD_TO_CAMPAIGN, AnalyzeAddToCampaign } from './analyze-add_to_campaign';
import {
    ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE,
    AnalyzeOpenExternalSocialProfile,
} from './analyze-open_external_social_profile';
import { BOOSTBOT_OPEN_BOOSTBOT_PAGE, OpenBoostbotPage } from './boostbot/open-boostbot-page';
import { BOOSTBOT_RECOMMEND_INFLUENCERS, RecommendInfluencers } from './boostbot/recommend-influencers';
import { BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH, SendInfluencersToOutreach } from './boostbot/send-influencers-to-outreach';
import { BOOSTBOT_UNLOCK_INFLUENCERS, UnlockInfluencers } from './boostbot/unlock-influencer';
import { SEARCH as SEARCH_KEY, Search } from './search';
import { SEARCH_ADD_TO_CAMPAIGN, SearchAddToCampaign } from './search-add_to_campaign';
import { SEARCH_ANALYZE_INFLUENCER, SearchAnalyzeInfluencer } from './search-analyze-influencer';
import { SEARCH_DEFAULT, SearchDefault } from './search-default';
import { SEARCH_LOAD_MORE_RESULTS, SearchLoadMoreResults } from './search-load_more_results';
import {
    SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE,
    SearchOpenExternalSocialProfile,
} from './search-open_external_social_profile';

export {
    Search,
    SearchDefault,
    SearchLoadMoreResults,
    SearchAddToCampaign,
    AnalyzeAddToCampaign,
    SearchAnalyzeInfluencer,
    SearchOpenExternalSocialProfile,
    AnalyzeOpenExternalSocialProfile,
    OpenBoostbotPage,
    RecommendInfluencers,
    UnlockInfluencers,
    SendInfluencersToOutreach
};

export const events = {
    [SEARCH_KEY]: Search,
    [SEARCH_DEFAULT]: SearchDefault,
    [SEARCH_LOAD_MORE_RESULTS]: SearchLoadMoreResults,
    [SEARCH_ANALYZE_INFLUENCER]: SearchAnalyzeInfluencer,
    [SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE]: SearchOpenExternalSocialProfile,
    [SEARCH_ADD_TO_CAMPAIGN]: SearchAddToCampaign,
    [ANALYZE_ADD_TO_CAMPAIGN]: AnalyzeAddToCampaign,
    [ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE]: AnalyzeOpenExternalSocialProfile,
    [BOOSTBOT_OPEN_BOOSTBOT_PAGE]: OpenBoostbotPage,
    [BOOSTBOT_RECOMMEND_INFLUENCERS]: RecommendInfluencers,
    [BOOSTBOT_UNLOCK_INFLUENCERS]: UnlockInfluencers,
    [BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH]: SendInfluencersToOutreach,
};

export const eventKeys = z.union([
    z.literal(SEARCH_KEY),
    z.literal(SEARCH_DEFAULT),
    z.literal(SEARCH_LOAD_MORE_RESULTS),
    z.literal(SEARCH_ANALYZE_INFLUENCER),
    z.literal(SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE),
    z.literal(SEARCH_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE),
    z.literal(BOOSTBOT_OPEN_BOOSTBOT_PAGE),
    z.literal(BOOSTBOT_RECOMMEND_INFLUENCERS),
    z.literal(BOOSTBOT_UNLOCK_INFLUENCERS),
    z.literal(BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH),
]);

export type eventKeys = z.infer<typeof eventKeys>;

export default events;
