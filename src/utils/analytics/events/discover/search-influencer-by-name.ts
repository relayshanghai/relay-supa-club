import type { EventPayload, TriggerEvent } from '../../types';

export const SEARCH_INFLUENCER_BY_NAME = 'Search Options, search for an influencer'; // renamed to 'Search Influencer By Name' in mixpanel lexicon.

export type SearchInfluencerByNamePayload = EventPayload<{
    search_query: string;
    platform: string;
}>;

export const SearchInfluencerByName = (trigger: TriggerEvent, value?: SearchInfluencerByNamePayload) =>
    trigger(SEARCH_INFLUENCER_BY_NAME, value);

export type SearchInfluencerByName = typeof SearchInfluencerByName;

SearchInfluencerByName.eventName = <typeof SEARCH_INFLUENCER_BY_NAME>SEARCH_INFLUENCER_BY_NAME;
