import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH_DEFAULT = 'search-default';

export type SearchDefaultPayload = EventPayload<{
    event_id: string | null;
    snapshot_id: string | null;
    parameters_id: string | null;
    parameters: any;
    page?: number;
}>;

export const SearchDefault = (trigger: TriggerEvent<SearchDefaultPayload>, payload?: SearchDefaultPayload) =>
    trigger(SEARCH_DEFAULT, payload);

export type SearchDefault = typeof SearchDefault;

SearchDefault.eventName = <typeof SEARCH_DEFAULT>SEARCH_DEFAULT;
