import type { TriggerEvent } from '../../types';

export const SEARCH_OPTIONS_SET_KEYWORD = 'Search Options, Set keyword';

export type SearchOptionsSetKeywordPayload = {
    search: { keyword: string };
};

export const SearchOptionsSetKeyword = (trigger: TriggerEvent, value?: SearchOptionsSetKeywordPayload) =>
    trigger(SEARCH_OPTIONS_SET_KEYWORD, { ...value });

SearchOptionsSetKeyword.eventName = <typeof SEARCH_OPTIONS_SET_KEYWORD>SEARCH_OPTIONS_SET_KEYWORD;
