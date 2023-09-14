import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const OPEN_ACCOUNT_MODAL = 'Open Account Modal';

export type OpenAccountModalPayload = {
    currentPage: CurrentPageEvent;
};

export const OpenAccountModal = (trigger: TriggerEvent, value?: OpenAccountModalPayload) =>
    trigger(OPEN_ACCOUNT_MODAL, { ...value });

OpenAccountModal.eventName = <typeof OPEN_ACCOUNT_MODAL>OPEN_ACCOUNT_MODAL;
