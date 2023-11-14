import { db } from 'src/utils/supabase-client';
import { fetchJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';

const QUEUE_NAME = 'default';

/**
 * Default queue - Basic queue; first-in, first-out
 */
export const Default: JobQueue<typeof QUEUE_NAME> = {
    name: QUEUE_NAME,
    run: async (payload) => {
        const queueName = payload?.queue ?? QUEUE_NAME;

        const jobs = await db(fetchJobs)({
            queue: queueName,
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
