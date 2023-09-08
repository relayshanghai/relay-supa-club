import type { TriggerEvent } from '../types';
import { CurrentPageEvent } from './current-pages';

export const OPEN_SOCIAL_PROFILE = 'Open Social Profile';

export type OpenSocialProfilePayload = {
    currentPage: CurrentPageEvent
};

export const OpenSocialProfile = (trigger: TriggerEvent, value?: OpenSocialProfilePayload) =>
    trigger(OPEN_SOCIAL_PROFILE, { ...value });

export type OpenSocialProfile = typeof OpenSocialProfile;

OpenSocialProfile.eventName = <typeof OPEN_SOCIAL_PROFILE>OPEN_SOCIAL_PROFILE;
