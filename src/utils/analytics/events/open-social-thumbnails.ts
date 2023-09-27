import type { TriggerEvent } from '../types';

export const OPEN_SOCIAL_THUMBNAILS = 'Open Social Thumbnails';

export type OpenSocialThumbnailsPayload = {
    is_unlocked: boolean;
    results_index: number;
    thumbnail_index: number;
    kol_id: string;
    platform: string;
    social_url: string;
    search_id: string | number | null;
    // search_results_page: number // 9999 for report
    // search_results_index: number // 9999 for report
};

export const OpenSocialThumbnails = (trigger: TriggerEvent, value?: OpenSocialThumbnailsPayload) =>
    trigger(OPEN_SOCIAL_THUMBNAILS, { ...value });

export type OpenSocialThumbnails = typeof OpenSocialThumbnails;

OpenSocialThumbnails.eventName = <typeof OPEN_SOCIAL_THUMBNAILS>OPEN_SOCIAL_THUMBNAILS;
