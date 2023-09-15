import type { EventPayload, TriggerEvent } from '../../types';

export const OPEN_GUIDE_SECTION_MODAL = 'Open Guide Section Modal';

export type OpenGuideSectionModalPayload = EventPayload<{
    section: string;
    user_open_count: number | null;
}>;

export const OpenGuideSectionModal = (trigger: TriggerEvent, value?: OpenGuideSectionModalPayload) =>
    trigger(OPEN_GUIDE_SECTION_MODAL, value);

export type OpenGuideSectionModal = typeof OpenGuideSectionModal;

OpenGuideSectionModal.eventName = <typeof OPEN_GUIDE_SECTION_MODAL>OPEN_GUIDE_SECTION_MODAL;
