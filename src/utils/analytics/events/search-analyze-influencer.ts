import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH_ANALYZE_INFLUENCER = 'search-analyze_influencer';

export type SearchAnalyzeInfluencerPayload = EventPayload;

export const SearchAnalyzeInfluencer = (trigger: TriggerEvent, value?: SearchAnalyzeInfluencerPayload) =>
    trigger(SEARCH_ANALYZE_INFLUENCER, value);

export type SearchAnalyzeInfluencer = typeof SearchAnalyzeInfluencer;

SearchAnalyzeInfluencer.eventName = <typeof SEARCH_ANALYZE_INFLUENCER>SEARCH_ANALYZE_INFLUENCER;
