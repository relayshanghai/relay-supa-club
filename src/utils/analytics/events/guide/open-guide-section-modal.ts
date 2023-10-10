import type { EventPayload, TriggerEvent } from '../../types';

// Event names:
// - Guide Page, modal opened
export const OPEN_GUIDE_SECTION_MODAL = 'Open Guide Section Modal';

export type OpenGuideSectionModalPayload = EventPayload<{
    section: string;
}>;

export const OpenGuideSectionModal = (trigger: TriggerEvent, value?: OpenGuideSectionModalPayload) =>
    trigger(OPEN_GUIDE_SECTION_MODAL, value);

export type OpenGuideSectionModal = typeof OpenGuideSectionModal;

OpenGuideSectionModal.eventName = <typeof OPEN_GUIDE_SECTION_MODAL>OPEN_GUIDE_SECTION_MODAL;
