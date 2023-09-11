import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE = 'search-open_external_social_profile';

export type SearchOpenExternalSocialProfilePayload = EventPayload;

export const SearchOpenExternalSocialProfile = (
    trigger: TriggerEvent,
    value?: SearchOpenExternalSocialProfilePayload,
) => trigger(SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE, value);

export type SearchOpenExternalSocialProfile = typeof SearchOpenExternalSocialProfile;

SearchOpenExternalSocialProfile.eventName = <typeof SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE>(
    SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE
);
