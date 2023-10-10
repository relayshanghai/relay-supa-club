import type { EventPayload, TriggerEvent } from '../../types';

// Event names:
// - Search Options, search for an influencer
export const SEARCH_INFLUENCER_BY_NAME = 'Search Influencer By Name';

export type SearchInfluencerByNamePayload = EventPayload<{
    search_query: string;
    platform: string;
}>;

export const SearchInfluencerByName = (trigger: TriggerEvent, value?: SearchInfluencerByNamePayload) =>
    trigger(SEARCH_INFLUENCER_BY_NAME, value);

export type SearchInfluencerByName = typeof SearchInfluencerByName;

SearchInfluencerByName.eventName = <typeof SEARCH_INFLUENCER_BY_NAME>SEARCH_INFLUENCER_BY_NAME;
