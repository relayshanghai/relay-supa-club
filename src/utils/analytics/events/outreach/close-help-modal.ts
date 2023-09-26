import type { TriggerEvent } from '../../types';

export const CLOSE_HELP_MODAL = 'Close Help Modal';

export type CloseHelpModalPayload = {
    type: string;
    modal_name: string;
    method: 'Button' | 'Off Modal Click' | 'X';
};

export const CloseHelpModal = (trigger: TriggerEvent, value?: CloseHelpModalPayload) =>
    trigger(CLOSE_HELP_MODAL, { ...value });

CloseHelpModal.eventName = <typeof CLOSE_HELP_MODAL>CLOSE_HELP_MODAL;
