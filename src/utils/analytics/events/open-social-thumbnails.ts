import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const OPEN_SOCIAL_THUMBNAILS = 'Open Social Thumbnails';

export type OpenSocialThumbnailsPayload = {
    currentPage: CurrentPageEvent;
    is_unlocked: boolean;
    results_index: number;
    thumbnail_index: number;
    kol_id: string;
    search_id: string | null;
};

export const OpenSocialThumbnails = (trigger: TriggerEvent, value?: OpenSocialThumbnailsPayload) =>
    trigger(OPEN_SOCIAL_THUMBNAILS, { ...value });

export type OpenSocialThumbnails = typeof OpenSocialThumbnails;

OpenSocialThumbnails.eventName = <typeof OPEN_SOCIAL_THUMBNAILS>OPEN_SOCIAL_THUMBNAILS;
