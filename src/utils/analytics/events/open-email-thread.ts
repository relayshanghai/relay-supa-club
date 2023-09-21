import type { TriggerEvent } from '../types';

export const OPEN_EMAIL_THREAD = 'Open Email Thread';

export type OpenEmailThreadPayload = {
    sequence_email_address: string;
    email_thread_id: string;
    selected_email_id: string;
    sender: unknown;
    recipient: unknown;
    open_when_clicked: boolean;
};

export const OpenEmailThread = (trigger: TriggerEvent, value?: OpenEmailThreadPayload) =>
    trigger(OPEN_EMAIL_THREAD, { ...value });

OpenEmailThread.eventName = <typeof OPEN_EMAIL_THREAD>OPEN_EMAIL_THREAD;
