import type { TrackedEvent } from '../types';

export const SEARCH = 'search';

export const Search: TrackedEvent = (trigger, value?) => trigger(SEARCH, value);

Search.eventName = SEARCH;
