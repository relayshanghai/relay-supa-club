import type { EventPayload, TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const OPEN_BOOSTBOT_FILTERS_MODAL = 'BoostBot Filter Modal, Open BoostBot filter modal'; // Display name set as 'Open Filters Modal';

export type OpenBoostbotFiltersModalPayload = EventPayload<{
    currentPage: CurrentPageEvent;
    batch_id: number;
}>;

export const OpenBoostbotFiltersModal = (trigger: TriggerEvent, value?: OpenBoostbotFiltersModalPayload) =>
    trigger(OPEN_BOOSTBOT_FILTERS_MODAL, value);

export type OpenBoostbotFiltersModal = typeof OpenBoostbotFiltersModal;

OpenBoostbotFiltersModal.eventName = <typeof OPEN_BOOSTBOT_FILTERS_MODAL>OPEN_BOOSTBOT_FILTERS_MODAL;
