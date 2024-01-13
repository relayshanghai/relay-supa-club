import { db } from 'src/utils/supabase-client';
import { fetchJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';
import { crumb } from 'src/utils/logger-server';

const QUEUE_NAME = 'default';

/**
 * Default queue - Basic queue; first-in, first-out
 */
export const Default: JobQueue<typeof QUEUE_NAME> = {
    name: QUEUE_NAME,
    run: async (payload) => {
        const queueName = payload?.queue ?? QUEUE_NAME;

        crumb({ message: `Start queue: ${queueName}` });
        const jobs = await db(fetchJobs)({
            queue: queueName,
            status: payload?.status ?? JOB_STATUS.pending,
            limit: payload?.limit ?? 1,
        });
        crumb({ message: `Fetched Jobs: ${jobs.length} @ ${queueName}` });
        const runningJobs = jobs.map(async (job) => {
            crumb({ message: `Start Job: ${job.id} @ ${queueName}` });
            const jobResult = await runJob(job);

            crumb({ message: `Finish Job: ${job.id} @ ${queueName}` });
            await finishJob(job, jobResult.status, jobResult.result);
            crumb({ message: `Done Job: ${job.id} @ ${queueName}` });
            return { job: job.id, result: jobResult.status === JOB_STATUS.success };
        });
        crumb({ message: `Settling Jobs: ${jobs.length} @ ${queueName}` });
        const finishedJobs = await Promise.allSettled(runningJobs);
        const results: { job: string; result: boolean }[] = finishedJobs.map((result) =>
            result.status === 'fulfilled' ? result.value : result.reason,
        );
        crumb({ message: `Done Queue: ${jobs.length} @ ${queueName}` });
        return results;
    },
};
