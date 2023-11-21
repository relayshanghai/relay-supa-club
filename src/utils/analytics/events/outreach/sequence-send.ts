import type { TriggerEvent } from '../../types';

export const SEQUENCE_SEND = 'email-outreach_sequence_send';

export type SequenceSendPayload = {
    is_success: boolean;
    account: string;
    sequence_influencer_id: string;
    extra_info?: any;
};

export const SequenceSend = (trigger: TriggerEvent, value?: SequenceSendPayload) =>
    trigger(SEQUENCE_SEND, { ...value });

SequenceSend.eventName = <typeof SEQUENCE_SEND>SEQUENCE_SEND;
