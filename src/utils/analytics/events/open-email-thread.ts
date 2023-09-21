import type { TriggerEvent } from '../types';

export const OPEN_EMAIL_THREAD = 'Open Email Thread';

export type OpenEmailThreadPayload = {
    sequenceEmailAddress: string;
    emailThreadId: string;
    selectedEmailId: string;
    sender: unknown;
    recipient: unknown;
    openWhenClicked: boolean;
};

export const OpenEmailThread = (trigger: TriggerEvent, value?: OpenEmailThreadPayload) =>
    trigger(OPEN_EMAIL_THREAD, { ...value });

OpenEmailThread.eventName = <typeof OPEN_EMAIL_THREAD>OPEN_EMAIL_THREAD;
