import type { TriggerEvent } from '../../types';
import type { CreatorSearchTag, LocationWeighted } from 'types';

export const SEARCH_TOPICS_INPUT_ADD_TAG = 'Search Topics Input, add a tag';

export type SearchTopicsInputAddTagPayload = {
    tag: CreatorSearchTag | LocationWeighted;
};

export const SearchTopicsInputAddTag = (trigger: TriggerEvent, value?: SearchTopicsInputAddTagPayload) =>
    trigger(SEARCH_TOPICS_INPUT_ADD_TAG, { ...value });

SearchTopicsInputAddTag.eventName = <typeof SEARCH_TOPICS_INPUT_ADD_TAG>SEARCH_TOPICS_INPUT_ADD_TAG;
