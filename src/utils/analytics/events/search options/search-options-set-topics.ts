import type { CreatorSearchTag } from 'types';
import type { TriggerEvent } from '../../types';

export const SEARCH_OPTIONS_SET_TOPICS = 'Search Options, Set topics';

export type SearchOptionsSetTopicsPayload = {
    search: { tags: CreatorSearchTag[] };
};

export const SearchOptionsSetTopics = (trigger: TriggerEvent, value?: SearchOptionsSetTopicsPayload) =>
    trigger(SEARCH_OPTIONS_SET_TOPICS, { ...value });

SearchOptionsSetTopics.eventName = <typeof SEARCH_OPTIONS_SET_TOPICS>SEARCH_OPTIONS_SET_TOPICS;
