import type { EventPayload, TriggerEvent } from '../types';

export const SEARCH_OPEN_SOCIAL_PROFILE = 'search-open_social_profile';

export type SearchOpenSocialProfilePayload = EventPayload;

export const SearchOpenSocialProfile = (trigger: TriggerEvent, value?: SearchOpenSocialProfilePayload) =>
    trigger(SEARCH_OPEN_SOCIAL_PROFILE, value);

export type SearchOpenSocialProfile = typeof SearchOpenSocialProfile;

SearchOpenSocialProfile.eventName = SEARCH_OPEN_SOCIAL_PROFILE;
