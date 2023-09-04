import type { EventPayload, TriggerEvent } from '../types';

export const ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE = 'analyze-open_external_social_profile';

export type AnalyzeOpenExternalSocialProfilePayload = EventPayload;

export const AnalyzeOpenExternalSocialProfile = (
    trigger: TriggerEvent,
    value?: AnalyzeOpenExternalSocialProfilePayload,
) => trigger(ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE, value);

export type AnalyzeOpenExternalSocialProfile = typeof AnalyzeOpenExternalSocialProfile;

AnalyzeOpenExternalSocialProfile.eventName = <typeof ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE>(
    ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE
);
