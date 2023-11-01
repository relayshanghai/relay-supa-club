import type { CreatorSearchTag } from 'types';
import type { TriggerEvent } from '../../types';

export const WORLD_CLOUD_COMPONENT_REMOVE_TAG = 'Word Cloud Component, Removed tag from wordcloud';

export type WorldCloudComponentRemoveTagPayload = {
    item: CreatorSearchTag;
};

export const WorldCloudComponentRemoveTag = (trigger: TriggerEvent, value?: WorldCloudComponentRemoveTagPayload) =>
    trigger(WORLD_CLOUD_COMPONENT_REMOVE_TAG, { ...value });

WorldCloudComponentRemoveTag.eventName = <typeof WORLD_CLOUD_COMPONENT_REMOVE_TAG>WORLD_CLOUD_COMPONENT_REMOVE_TAG;
