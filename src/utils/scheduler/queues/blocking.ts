import { db } from 'src/utils/supabase-client';
import { fetchJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';

/**
 * Blocking queue - A failing job will be retried until it becomes successful
 */
export const Blocking: JobQueue<'blocking'> = {
    name: 'blocking',
    run: async (payload) => {
        const jobs = await db(fetchJobs)({
            queue: 'blocking',
            status: payload?.status ?? JOB_STATUS.pending,
            limit: payload?.limit ?? 1,
        });

        const runningJobs = jobs.map(async (job) => {
            const res = await runJob(job);

            // only mark jobs finished if successful
            const status = res.status === JOB_STATUS.success ? JOB_STATUS.success : JOB_STATUS.pending;
            await finishJob(job, status, res.result);

            return { job: job.id, result: res.status === JOB_STATUS.success };
        });

        const finishedJobs = await Promise.allSettled(runningJobs);
        const results: { job: string; result: boolean }[] = finishedJobs.map((result) =>
            result.status === 'fulfilled' ? result.value : result.reason,
        );

        return results;
    },
};
