import type { EventPayload, TriggerEvent } from '../../types';

// Event name:
// - Search Filter Modal, Open search filter modal
export const OPEN_FILTERS_MODAL = 'Open Filters Modal';

export type OpenFiltersModalPayload = EventPayload<{
    batch_id: number;
}>;

export const OpenFiltersModal = (trigger: TriggerEvent, value?: OpenFiltersModalPayload) =>
    trigger(OPEN_FILTERS_MODAL, value);

export type OpenFiltersModal = typeof OpenFiltersModal;

OpenFiltersModal.eventName = <typeof OPEN_FILTERS_MODAL>OPEN_FILTERS_MODAL;
