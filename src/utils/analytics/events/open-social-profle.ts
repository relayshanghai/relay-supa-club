import type { TriggerEvent } from '../types';

export const OPEN_SOCIAL_PROFILE = 'Open Social Profile';

export type OpenSocialProfilePayload = {
    results_index: number;
    results_page: number;
    kol_id: string;
    platform: string;
    social_url: string;
    search_id: string | number | null;
    // search_results_page: number // 9999 for report
    // search_results_index: number // 9999 for report
};

export const OpenSocialProfile = (trigger: TriggerEvent, value?: OpenSocialProfilePayload) =>
    trigger(OPEN_SOCIAL_PROFILE, { ...value });

export type OpenSocialProfile = typeof OpenSocialProfile;

OpenSocialProfile.eventName = <typeof OPEN_SOCIAL_PROFILE>OPEN_SOCIAL_PROFILE;
