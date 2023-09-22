import type { EventPayload, TriggerEvent } from '../../types';

export const SEARCH_INFLUENCER_MANAGER = 'Search Influencer Manager';

export type SearchInfluencerManagerPayload = EventPayload<{
    query: string;
    total_results: number;
}>;

export const SearchInfluencerManager = (
    trigger: TriggerEvent<SearchInfluencerManagerPayload>,
    payload?: SearchInfluencerManagerPayload,
) => trigger(SEARCH_INFLUENCER_MANAGER, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
SearchInfluencerManager.eventName = <typeof SEARCH_INFLUENCER_MANAGER>SEARCH_INFLUENCER_MANAGER;
