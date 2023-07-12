import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH = 'search';

export type SearchPayload = EventPayload<{
    snapshot_id: string | null;
    parameters: any;
    page?: number;
}>;

export const Search = (trigger: TriggerEvent<SearchPayload>, payload?: SearchPayload) => trigger(SEARCH, payload);

export type Search = typeof Search;

Search.eventName = SEARCH;
