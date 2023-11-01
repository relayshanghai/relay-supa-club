import type { TriggerEvent } from '../../types';

export const SEARCH_OPTIONS_SET_HASHTAG = 'Search Options, Set hashtag';

export type SearchOptionsSetHashtagPayload = {
    search: { hashtags: string[] };
};

export const SearchOptionsSetHashtag = (trigger: TriggerEvent, value?: SearchOptionsSetHashtagPayload) =>
    trigger(SEARCH_OPTIONS_SET_HASHTAG, { ...value });

SearchOptionsSetHashtag.eventName = <typeof SEARCH_OPTIONS_SET_HASHTAG>SEARCH_OPTIONS_SET_HASHTAG;
