import type { TrackedEvent } from '../types';

export const SEARCH_ANALYZE_INFLUENCER = 'search-analyze_influencer';

export const SearchAnalyzeInfluencer: TrackedEvent = (trigger, value?) => trigger(SEARCH_ANALYZE_INFLUENCER, value);

SearchAnalyzeInfluencer.eventName = SEARCH_ANALYZE_INFLUENCER;
