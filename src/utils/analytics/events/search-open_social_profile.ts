import type { TrackedEvent } from '../types';

export const SEARCH_OPEN_SOCIAL_PROFILE = 'search-open_social_profile';

export const SearchOpenSocialProfile: TrackedEvent = (trigger, value?) => trigger(SEARCH_OPEN_SOCIAL_PROFILE, value);

SearchOpenSocialProfile.eventName = SEARCH_OPEN_SOCIAL_PROFILE;
