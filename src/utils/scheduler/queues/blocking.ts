import { db } from 'src/utils/supabase-client';
import { getJobs, fetchJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';
import { serverLogger } from 'src/utils/logger-server';

const QUEUE_NAME = 'blocking';

/**
 * Blocking queue - A failing job will be retried until it becomes successful
 */
export const Blocking: JobQueue<typeof QUEUE_NAME> = {
    name: QUEUE_NAME,
    run: async (payload) => {
        const queueName = payload?.queue ?? QUEUE_NAME;

        const running = await db(getJobs)({
            queue: queueName,
            status: JOB_STATUS.running,
            limit: 1,
        });

        // Prevent blocking queues from running if a job is stuck
        if (running.length > 0) {
            const runningJob = running[0];
            serverLogger(`Cannot process ${queueName} queue. A job is stuck in running`, (scope) => {
                return scope.setContext('Job', {
                    job: runningJob.id,
                });
            });
            throw new Error(`Cannot process ${queueName} queue. A job is stuck in running`);
        }

        const jobs = await db(fetchJobs)({
            queue: queueName,
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
