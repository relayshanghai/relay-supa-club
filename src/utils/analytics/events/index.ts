import { z } from 'zod';
import type { TrackedEvent } from '../types';
import type { AnalyzeAddToCampaignPayload } from './analyze-add_to_campaign';
import { ANALYZE_ADD_TO_CAMPAIGN, AnalyzeAddToCampaign } from './analyze-add_to_campaign';
import type {
    AnalyzeOpenExternalSocialProfilePayload
} from './analyze-open_external_social_profile';
import {
    ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE,
    AnalyzeOpenExternalSocialProfile
} from './analyze-open_external_social_profile';
import type { AddInfluencerToSequencePayload } from './outreach/add-influencer-to-sequence';
import { AddInfluencerToSequence, OUTREACH_ADD_INFLUENCER_TO_SEQUENCE } from './outreach/add-influencer-to-sequence';
import { OUTREACH_OPEN_INBOX_PAGE, OpenInboxPage, OpenInboxPagePayload } from './outreach/open-inbox-page';
import { OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE, OpenInfluencerManagerPage, OpenInfluencerManagerPagePayload } from './outreach/open-influencer-manager-page';
import { OUTREACH_OPEN_SEQUENCES_PAGE, OpenSequencesPage, OpenSequencesPagePayload } from './outreach/open-sequences-page';
import type { SearchPayload } from './search';
import { SEARCH as SEARCH_KEY, Search } from './search';
import type { SearchAddToCampaignPayload } from './search-add_to_campaign';
import { SEARCH_ADD_TO_CAMPAIGN, SearchAddToCampaign } from './search-add_to_campaign';
import type { SearchAnalyzeInfluencerPayload } from './search-analyze-influencer';
import { SEARCH_ANALYZE_INFLUENCER, SearchAnalyzeInfluencer } from './search-analyze-influencer';
import type { SearchDefaultPayload } from './search-default';
import { SEARCH_DEFAULT, SearchDefault } from './search-default';
import type { SearchLoadMoreResultsPayload } from './search-load_more_results';
import { SEARCH_LOAD_MORE_RESULTS, SearchLoadMoreResults } from './search-load_more_results';
import type {
    SearchOpenExternalSocialProfilePayload
} from './search-open_external_social_profile';
import {
    SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE,
    SearchOpenExternalSocialProfile
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
    AddInfluencerToSequence,
    OpenSequencesPage,
    OpenInboxPage,
    OpenInfluencerManagerPage
};

export const events: { [k in eventKeys]: TrackedEvent } = {
    [SEARCH_KEY]: Search,
    [SEARCH_DEFAULT]: SearchDefault,
    [SEARCH_LOAD_MORE_RESULTS]: SearchLoadMoreResults,
    [SEARCH_ANALYZE_INFLUENCER]: SearchAnalyzeInfluencer,
    [SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE]: SearchOpenExternalSocialProfile,
    [SEARCH_ADD_TO_CAMPAIGN]: SearchAddToCampaign,
    [ANALYZE_ADD_TO_CAMPAIGN]: AnalyzeAddToCampaign,
    [ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE]: AnalyzeOpenExternalSocialProfile,
    [OUTREACH_ADD_INFLUENCER_TO_SEQUENCE]: AddInfluencerToSequence,
    [OUTREACH_OPEN_SEQUENCES_PAGE]: OpenSequencesPage,
    [OUTREACH_OPEN_INBOX_PAGE]: OpenInboxPage,
    [OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE]: OpenInfluencerManagerPage,
};

export type payloads = {
    [SEARCH_KEY]: SearchPayload,
    [SEARCH_DEFAULT]: SearchDefaultPayload,
    [SEARCH_LOAD_MORE_RESULTS]: SearchLoadMoreResultsPayload,
    [SEARCH_ANALYZE_INFLUENCER]: SearchAnalyzeInfluencerPayload,
    [SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE]: SearchOpenExternalSocialProfilePayload,
    [SEARCH_ADD_TO_CAMPAIGN]: SearchAddToCampaignPayload,
    [ANALYZE_ADD_TO_CAMPAIGN]: AnalyzeAddToCampaignPayload,
    [ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE]: AnalyzeOpenExternalSocialProfilePayload,
    [OUTREACH_ADD_INFLUENCER_TO_SEQUENCE]: AddInfluencerToSequencePayload,
    [OUTREACH_OPEN_SEQUENCES_PAGE]: OpenSequencesPagePayload,
    [OUTREACH_OPEN_INBOX_PAGE]: OpenInboxPagePayload,
    [OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE]: OpenInfluencerManagerPagePayload,
};

// @note we are using these eventKeys on other zod objects for validation
//       hopefully next time we can just use the `keyof events` type and use that
export const eventKeys = z.union([
    z.literal(SEARCH_KEY),
    z.literal(SEARCH_DEFAULT),
    z.literal(SEARCH_LOAD_MORE_RESULTS),
    z.literal(SEARCH_ANALYZE_INFLUENCER),
    z.literal(SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE),
    z.literal(SEARCH_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE),
    z.literal(OUTREACH_ADD_INFLUENCER_TO_SEQUENCE),
    z.literal(OUTREACH_OPEN_SEQUENCES_PAGE),
    z.literal(OUTREACH_OPEN_INBOX_PAGE),
    z.literal(OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE),
]);

export type eventKeys = z.infer<typeof eventKeys>;

export default events;
