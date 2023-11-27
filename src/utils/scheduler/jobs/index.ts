import { TrackAnalyticsEvent } from './track-analytics-event';
import { SequenceSendEvent } from './sequence-send';
import { SequenceStepSend } from '../queues/sequence-step-send';
import { SequenceStepSendEvent } from './sequence-step-send';

export const jobs = {
    [TrackAnalyticsEvent.name]: TrackAnalyticsEvent,
    [SequenceSendEvent.name]: SequenceSendEvent,
    [SequenceStepSend.name]: SequenceStepSendEvent,
};

export type JobNames = keyof typeof jobs;

export type JobType<T = any> = T extends JobNames ? (typeof jobs)[T] : never;

export const isValidJob = (name: string): name is JobNames => {
    return name in jobs;
};
