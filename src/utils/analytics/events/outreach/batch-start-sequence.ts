import type { SendResult } from 'pages/api/sequence/send';
import type { EventPayload, TriggerEvent } from '../../types';

export const BATCH_START_SEQUENCE = 'Batch Start Sequence';

export type BatchStartSequencePayload = EventPayload<{
    sequence_id: string | null;
    sequence_name: string | null;
    sequence_influencer_ids: string[] | null;
    is_success: boolean;
    sent_success?: SendResult[];
    sent_success_count?: number | null;
    sent_failed?: SendResult[];
    sent_failed_count?: number | null;
    extra_info?: any;
}>;

export const BatchStartSequence = (
    trigger: TriggerEvent<BatchStartSequencePayload>,
    payload?: BatchStartSequencePayload,
) => trigger(BATCH_START_SEQUENCE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
BatchStartSequence.eventName = <typeof BATCH_START_SEQUENCE>BATCH_START_SEQUENCE;
