import { v4 } from 'uuid';
import type { Jobs } from '../api/db';
import { serverLogger } from '../logger-server';
import { db } from '../supabase-client';
import { createJob as createJobDb, finishJob as finishJobDb } from './db-queries';
import type { JobNames } from './jobs';
import { isValidJob, jobs } from './jobs';
import { JOB_STATUS } from './types';
import { now } from '../datetime';
import type { JOB_QUEUE } from './queues';

export const initJob = (name: string) => {
    if (isValidJob(name)) {
        return jobs[name];
    }

    throw new Error(`Invalid Job: ${name}`);
};

export const runJob = async (job: Jobs['Row']) => {
    let result = null;
    let status = JOB_STATUS.success;

    try {
        const jobInstance = initJob(job.name);
        result = await jobInstance.run(job.payload);
        status = JOB_STATUS.success;
    } catch (e) {
        status = JOB_STATUS.failed;

        serverLogger(e);
        result = { error: new Error(String(e)).message };
    }

    return { result, status };
};

/**
 * Mark a job as processed
 * In case of failure in calling supabase, do it's best to log what happened
 */
export const finishJob = async (job: Jobs['Row'], status: Omit<JOB_STATUS, 'running'>, result: any) => {
    try {
        await db(finishJobDb)(job, status, result);
        return true;
    } catch (e) {
        // In case the call to Supabase fails for some reason,
        // suppress the error and notify Sentry instead
        serverLogger('Job stuck on running', (scope) => {
            return scope.setContext('Job', {
                job: job.id,
                status,
                result: JSON.stringify(result),
                error: e,
            });
        });
    }

    return false;
};

type CreateJobInsert = Pick<Jobs['Insert'], 'payload' | 'owner'> & {
    name: JobNames;
    queue?: JOB_QUEUE;
    run_at?: string;
};

export const createJob = async (job: CreateJobInsert) => {
    const { run_at, queue } = job;
    const id = v4();
    const schedule = run_at ?? now();

    try {
        return await db(createJobDb)(id, {
            name: job.name,
            run_at: schedule,
            payload: job.payload,
            queue: queue ?? 'default',
            owner: job.owner,
        });
    } catch (error) {
        serverLogger('Cannot create job', (scope) => {
            return scope.setContext('Job', {
                job: job.name,
                queue,
                payload: JSON.stringify(job.payload ?? {}),
                owner: job.owner,
                run_at: schedule,
                error,
            });
        });
    }

    return false;
};
