import { AnalyticsTrackingEvent } from './analytics-tracking-event';
import { Foo } from './foo';

export const jobs = {
    [Foo.name]: Foo,
    [AnalyticsTrackingEvent.name]: AnalyticsTrackingEvent,
};

export type JobNames = keyof typeof jobs;

export const isValidJob = (name: string): name is JobNames => {
    return name in jobs;
};
