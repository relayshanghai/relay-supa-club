import type { EventPayload, TriggerEvent } from '../types';

export const ANALYZE_OPEN_SOCIAL_PROFILE = 'analyze-open_social_profile';

export type AnalyzeOpenSocialProfilePayload = EventPayload;

export const AnalyzeOpenSocialProfile = (trigger: TriggerEvent, value?: AnalyzeOpenSocialProfilePayload) =>
    trigger(ANALYZE_OPEN_SOCIAL_PROFILE, value);

export type AnalyzeOpenSocialProfile = typeof AnalyzeOpenSocialProfile;

AnalyzeOpenSocialProfile.eventName = ANALYZE_OPEN_SOCIAL_PROFILE;
