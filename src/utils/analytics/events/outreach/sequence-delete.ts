import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const DELETE_SEQUENCE = 'Delete Sequence';

export type DeleteSequencePayload = {
    currentPage: CurrentPageEvent;
    sequence_id: string;
    total_influencers: number;
};

export const DeleteSequence = (trigger: TriggerEvent, value?: DeleteSequencePayload) =>
    trigger(DELETE_SEQUENCE, { ...value });

export type DeleteSequence = typeof DeleteSequence;

DeleteSequence.eventName = <typeof DELETE_SEQUENCE>DELETE_SEQUENCE;
