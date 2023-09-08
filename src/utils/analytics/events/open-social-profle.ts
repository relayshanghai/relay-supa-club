import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const OPEN_SOCIAL_PROFILE = 'TEST:Open Social Profile';

export type OpenSocialProfilePayload = {
    currentPage: CurrentPageEvent;
    is_unlocked: boolean;
    results_index: number;
    results_page: number;
    kol_id: string;
    search_id: string | null;
};

export const OpenSocialProfile = (trigger: TriggerEvent, value?: OpenSocialProfilePayload) =>
    trigger(OPEN_SOCIAL_PROFILE, { ...value });

export type OpenSocialProfile = typeof OpenSocialProfile;

OpenSocialProfile.eventName = <typeof OPEN_SOCIAL_PROFILE>OPEN_SOCIAL_PROFILE;
