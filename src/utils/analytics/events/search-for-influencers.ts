import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH_FOR_INFLUENCERS = 'Search For Influencers';

export type SearchForInfluencersPayload = EventPayload;

export const SearchForInfluencers = (trigger: TriggerEvent, value?: SearchForInfluencersPayload) =>
    trigger(SEARCH_FOR_INFLUENCERS, { ...value });

SearchForInfluencers.eventName = <typeof SEARCH_FOR_INFLUENCERS>SEARCH_FOR_INFLUENCERS;
