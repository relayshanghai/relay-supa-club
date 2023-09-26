import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH_ADD_TO_CAMPAIGN = 'search-add_to_campaign';

export type SearchAddToCampaignPayload = EventPayload;

export const SearchAddToCampaign = (trigger: TriggerEvent, value?: SearchAddToCampaignPayload) =>
    trigger(SEARCH_ADD_TO_CAMPAIGN, value);

export type SearchAddToCampaign = typeof SearchAddToCampaign;

SearchAddToCampaign.eventName = <typeof SEARCH_ADD_TO_CAMPAIGN>SEARCH_ADD_TO_CAMPAIGN;
