import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const OPEN_SEQUENCE = 'Open Sequence';

export type OpenSequencePayload = {
    currentPage: CurrentPageEvent;
    openCount: number;
    sequenceId: string;
    totalInfluencers: number;
    influencerSequenceStarted: number;
};

export const OpenSequence = (trigger: TriggerEvent, value?: OpenSequencePayload) =>
    trigger(OPEN_SEQUENCE, { ...value });

OpenSequence.eventName = <typeof OPEN_SEQUENCE>OPEN_SEQUENCE;
