import type { EventPayload, TriggerEvent } from '../../types';

// Event names:
// - outreach-create_sequence
export const OUTREACH_CREATE_SEQUENCE = 'Create Sequence';

export type CreateSequencePayload = EventPayload<{
    sequence_id: string | null;
    sequence_name: string;
    is_success: boolean;
    extra_info?: any;
    // product: string
}>;

export const CreateSequence = (trigger: TriggerEvent<CreateSequencePayload>, payload?: CreateSequencePayload) =>
    trigger(OUTREACH_CREATE_SEQUENCE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
CreateSequence.eventName = <typeof OUTREACH_CREATE_SEQUENCE>OUTREACH_CREATE_SEQUENCE;
