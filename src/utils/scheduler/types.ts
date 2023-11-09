import type { JobNames } from './jobs';

export const SCHEDULER_TOKEN_HEADER = 'x-scheduler-token';
export const SCHEDULER_TOKEN_KEY = 'SCHEDULER_WORKER_KEY';

export enum JOB_QUEUE {
    default = 'default',
    failed = 'failed',
}

export enum JOB_STATUS {
    pending = 'pending',
    success = 'success',
    failed = 'failed',
    running = 'running',
}

export type JobInterface<T> = {
    name: T;
    /**
     * The logic for running the job. Must throw an error to fail
     * @throws Error
     */
    run: (payload?: Record<string, any>) => Promise<any>;
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
