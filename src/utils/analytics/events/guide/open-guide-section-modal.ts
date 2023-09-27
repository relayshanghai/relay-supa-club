import type { EventPayload, TriggerEvent } from '../../types';

export const OPEN_GUIDE_SECTION_MODAL = 'Guide Page, modal opened';

export type OpenGuideSectionModalPayload = EventPayload<{
    section: string;
}>;

export const OpenGuideSectionModal = (trigger: TriggerEvent, value?: OpenGuideSectionModalPayload) =>
    trigger(OPEN_GUIDE_SECTION_MODAL, value);

export type OpenGuideSectionModal = typeof OpenGuideSectionModal;

OpenGuideSectionModal.eventName = <typeof OPEN_GUIDE_SECTION_MODAL>OPEN_GUIDE_SECTION_MODAL;
