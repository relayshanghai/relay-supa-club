import { db } from 'src/utils/supabase-client';
import { getJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';

/**
 * Default queue - Basic queue; first-in, first-out
 */
export const Default: JobQueue<'default'> = {
    name: 'default',
    run: async (payload) => {
        const jobs = await db(getJobs)({
            queue: 'default',
            status: payload?.status ?? JOB_STATUS.pending,
            limit: payload?.limit ?? 1,
        });

        const runningJobs = jobs.map(async (job) => {
            const res = await runJob(job);
            await finishJob(job, res.status, res.result);
            return { job: job.id, result: res.status === JOB_STATUS.success };
        });

        const finishedJobs = await Promise.allSettled(runningJobs);
        const results: { job: string; result: boolean }[] = finishedJobs.map((result) =>
            result.status === 'fulfilled' ? result.value : result.reason,
        );

        return results;
    },
};