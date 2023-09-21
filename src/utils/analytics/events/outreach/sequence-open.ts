import type { TriggerEvent } from '../../types';

export const OPEN_SEQUENCE = 'Open Sequence';

export type OpenSequencePayload = {
    open_count: number;
    sequence_id: string;
    total_influencers: number;
};

export const OpenSequence = (trigger: TriggerEvent, value?: OpenSequencePayload) =>
    trigger(OPEN_SEQUENCE, { ...value });

OpenSequence.eventName = <typeof OPEN_SEQUENCE>OPEN_SEQUENCE;
