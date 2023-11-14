import { TrackAnalyticsEvent } from './track-analytics-event';
import { Foo } from './foo';

export const jobs = {
    [Foo.name]: Foo,
    [TrackAnalyticsEvent.name]: TrackAnalyticsEvent,
};

export type JobNames = keyof typeof jobs;

export const isValidJob = (name: string): name is JobNames => {
    return name in jobs;
};
