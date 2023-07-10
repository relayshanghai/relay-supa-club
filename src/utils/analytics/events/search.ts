import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH = 'search';

export type SearchPayload = EventPayload<{
    parameters: any;
}>;

export const Search = (trigger: TriggerEvent<SearchPayload>, payload?: SearchPayload) => trigger(SEARCH, payload);

export type Search = typeof Search;

Search.eventName = SEARCH;
