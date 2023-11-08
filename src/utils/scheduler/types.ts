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

export type JobInterface = {
    name: string;
    run: (...args: any[]) => Promise<boolean>;
};

// @note we really should standardize this
export type CreateJobRequest = {
    body: {
        name: string;
        run_at: string;
        payload: Record<string, any>;
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
