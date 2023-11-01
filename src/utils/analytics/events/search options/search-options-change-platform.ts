import type { CreatorPlatform } from 'types';
import type { TriggerEvent } from '../../types';

export const SEARCH_OPTIONS_CHANGE_PLATFORM = 'Change Targeted Platform';

export type SearchOptionsChangePlatformPayload = {
    platform: CreatorPlatform;
    current_platform: CreatorPlatform;
};

export const SearchOptionsChangePlatform = (trigger: TriggerEvent, value?: SearchOptionsChangePlatformPayload) =>
    trigger(SEARCH_OPTIONS_CHANGE_PLATFORM, { ...value });

SearchOptionsChangePlatform.eventName = <typeof SEARCH_OPTIONS_CHANGE_PLATFORM>SEARCH_OPTIONS_CHANGE_PLATFORM;
