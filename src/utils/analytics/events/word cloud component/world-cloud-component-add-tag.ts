import type { TriggerEvent } from '../../types';

export const WORLD_CLOUD_COMPONENT_ADD_TAG = 'Select TopicCloud Topic';

export type WorldCloudComponentAddTagPayload = {
    tag: string;
    value: string;
    search_topic: string;
    all_selected_topics: string[];
};

export const WorldCloudComponentAddTag = (trigger: TriggerEvent, value?: WorldCloudComponentAddTagPayload) =>
    trigger(WORLD_CLOUD_COMPONENT_ADD_TAG, { ...value });

WorldCloudComponentAddTag.eventName = <typeof WORLD_CLOUD_COMPONENT_ADD_TAG>WORLD_CLOUD_COMPONENT_ADD_TAG;
