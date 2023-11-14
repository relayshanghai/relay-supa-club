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

export const finishJob = async (job: Jobs['Row'], status: Omit<JOB_STATUS, 'running'>, result: any) => {
    try {
        db(finishJobDb)(job, status, result);
        return true;
    } catch (e) {
        // In case the call to Supabase fails for some reason,
        // suppress the error and notify Sentry instead
        serverLogger('Failed database call', (scope) => {
            return scope.setContext('Error', {
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

    return await db(createJobDb)(v4(), {
        name: job.name,
        run_at: run_at ?? now(),
        payload: job.payload,
        queue: queue ?? 'default',
        owner: job.owner,
    });
};
