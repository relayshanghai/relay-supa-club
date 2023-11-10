import { v4 } from 'uuid';
import type { Jobs } from '../api/db';
import { serverLogger } from '../logger-server';
import { db } from '../supabase-client';
import { createJob as createJobDb, finishJob } from './db-queries';
import { isValidJob, jobs } from './jobs';
import { JOB_STATUS } from './types';

export const initJob = (name: string) => {
    if (isValidJob(name)) {
        return jobs[name];
    }

    throw new Error(`Invalid Job: ${name}`);
};

export const runJob = async (job: Jobs['Row']) => {
    const ret = { job: job.id, result: true };
    let result = null;
    let status = JOB_STATUS.success;

    try {
        const jobInstance = initJob(job.name);
        result = await jobInstance.run(job.payload);
        status = JOB_STATUS.success;
    } catch (e) {
        ret.result = false;
        status = JOB_STATUS.failed;

        serverLogger(e);
        result = { error: new Error(String(e)).message };
    }

    try {
        db(finishJob)(job, status, result);
    } catch (e) {
        // In case the call to Supabase fails for some reason,
        // suppress the error and notify Sentry instead
        serverLogger('Failed database call', (scope) => {
            return scope.setContext('Error', {
                error: e,
            });
        });
    }

    return ret;
};

type CreateJobInsert = Pick<Jobs['Insert'], 'name' | 'run_at' | 'payload' | 'queue' | 'owner'>;

export const createJob = async (job: CreateJobInsert) => {
    return await db(createJobDb)(v4(), {
        name: job.name,
        run_at: job.run_at,
        payload: job.payload,
        queue: job.queue,
        owner: job.owner,
    });
};
