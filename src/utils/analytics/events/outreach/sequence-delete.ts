import type { TriggerEvent } from '../../types';

export const DELETE_SEQUENCE = 'Delete Sequence';

export type DeleteSequencePayload = {
    sequence_id: string;
    total_influencers: number;
};

export const DeleteSequence = (trigger: TriggerEvent, value?: DeleteSequencePayload) =>
    trigger(DELETE_SEQUENCE, { ...value });

export type DeleteSequence = typeof DeleteSequence;

DeleteSequence.eventName = <typeof DELETE_SEQUENCE>DELETE_SEQUENCE;
