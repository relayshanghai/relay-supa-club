import { TrackAnalyticsEvent } from './track-analytics-event';
import { SequenceStepSendEvent } from './sequence-step-send';

export const jobs = {
    [TrackAnalyticsEvent.name]: TrackAnalyticsEvent,
    [SequenceStepSendEvent.name]: SequenceStepSendEvent,
};

export type JobNames = keyof typeof jobs;

export type JobType<T = any> = T extends JobNames ? (typeof jobs)[T] : never;

export const isValidJob = (name: string): name is JobNames => {
    return name in jobs;
};
