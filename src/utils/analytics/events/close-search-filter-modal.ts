import type { TriggerEvent } from '../types';

export const CLOSE_SEARCH_FILTER_MODAL = 'Search Filter Modal, Close search filter modal';

export type CloseSearchFilterModalPayload = {
    search: string;
};

export const CloseSearchFilterModal = (trigger: TriggerEvent, value?: CloseSearchFilterModalPayload) =>
    trigger(CLOSE_SEARCH_FILTER_MODAL, { ...value });

CloseSearchFilterModal.eventName = <typeof CLOSE_SEARCH_FILTER_MODAL>CLOSE_SEARCH_FILTER_MODAL;
