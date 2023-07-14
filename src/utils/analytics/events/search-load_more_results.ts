import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH_LOAD_MORE_RESULTS = 'search-load_more_results';

export type SearchLoadMoreResultsPayload = EventPayload<{
    event_id: string | null;
    snapshot_id: string | null;
    parameters: any;
    page: number;
}>;

export const SearchLoadMoreResults = (trigger: TriggerEvent, value?: SearchLoadMoreResultsPayload) =>
    trigger(SEARCH_LOAD_MORE_RESULTS, value);

export type SearchLoadMoreResults = typeof SearchLoadMoreResults;

SearchLoadMoreResults.eventName = SEARCH_LOAD_MORE_RESULTS;
