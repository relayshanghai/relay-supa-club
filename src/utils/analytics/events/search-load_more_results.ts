import type { TrackedEvent } from '../types';

export const SEARCH_LOAD_MORE_RESULTS = 'search-load_more_results';

export const SearchLoadMoreResults: TrackedEvent = (trigger, value?) => trigger(SEARCH_LOAD_MORE_RESULTS, value);

SearchLoadMoreResults.eventName = SEARCH_LOAD_MORE_RESULTS;
