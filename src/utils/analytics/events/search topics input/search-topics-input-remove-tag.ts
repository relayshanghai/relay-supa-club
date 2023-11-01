import type { TriggerEvent } from '../../types';
import type { CreatorSearchTag, LocationWeighted } from 'types';

export const SEARCH_TOPICS_INPUT_REMOVE_TAG = 'Search Topics Input, remove a tag';

export type SearchTopicsInputRemoveTagPayload = {
    tag: CreatorSearchTag | LocationWeighted;
};

export const SearchTopicsInputRemoveTag = (trigger: TriggerEvent, value?: SearchTopicsInputRemoveTagPayload) =>
    trigger(SEARCH_TOPICS_INPUT_REMOVE_TAG, { ...value });

SearchTopicsInputRemoveTag.eventName = <typeof SEARCH_TOPICS_INPUT_REMOVE_TAG>SEARCH_TOPICS_INPUT_REMOVE_TAG;
