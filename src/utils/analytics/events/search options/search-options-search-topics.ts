import type { CreatorSearchTag, LocationWeighted } from 'types';
import type { TriggerEvent } from '../../types';

export const SEARCH_OPTIONS_SEARCH_TOPICS = 'Search Options, search topics';

export type SearchOptionsSearchTopicsPayload = {
    topic: CreatorSearchTag | LocationWeighted;
};

export const SearchOptionsSearchTopics = (trigger: TriggerEvent, value?: SearchOptionsSearchTopicsPayload) =>
    trigger(SEARCH_OPTIONS_SEARCH_TOPICS, { ...value });

SearchOptionsSearchTopics.eventName = <typeof SEARCH_OPTIONS_SEARCH_TOPICS>SEARCH_OPTIONS_SEARCH_TOPICS;
