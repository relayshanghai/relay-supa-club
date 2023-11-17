import type { JobNames } from './jobs';
import type { JOB_QUEUE } from './queues';

export const SCHEDULER_TOKEN_HEADER = 'x-scheduler-token';
export const SCHEDULER_TOKEN_KEY = 'SCHEDULER_WORKER_TOKEN';

export enum JOB_STATUS {
    pending = 'pending',
    success = 'success',
    failed = 'failed',
    running = 'running',
}

type JobQueueResult = { job: string; result: boolean };

export type JobInterface<T, TRun = (payload?: any) => Promise<any>> = {
    name: T;
    /**
     * The logic for running the job. Must throw an error to fail
     * @throws Error
     */
    run: TRun;
};

export type JobQueueRunPayload = {
    queue?: JOB_QUEUE;
    status?: JOB_STATUS;
    limit?: number;
};

export type JobQueue<T> = {
    name: T;
    /**
     * Logic for processing a queue
     */
    run: (payload?: JobQueueRunPayload) => Promise<JobQueueResult[]>;
};

// @note we really should standardize this
export type CreateJobRequest = {
    body: {
        name: JobNames;
        run_at: string;
        payload?: Record<string, any>;
        queue?: JOB_QUEUE;
    };
};

export type RunJobRequest = {
    query: {
        queue?: JOB_QUEUE;
        status?: JOB_STATUS;
        limit?: number;
    };
};
