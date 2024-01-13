import { db } from 'src/utils/supabase-client';
import { getJobs, fetchJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';
import { serverLogger } from 'src/utils/logger-server';

const QUEUE_NAME = 'blocking';

const RUNNING_JOB_STUCK_THRESHOLD = 10;

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

        const runningJob = running.length > 0 ? running[0] : null;

        // Prevent blocking queues from running if a job is stuck
        if (runningJob && (runningJob.retry_count ?? 0) >= RUNNING_JOB_STUCK_THRESHOLD) {
            serverLogger(`Cannot process ${queueName} queue. A job is stuck in running`, (scope) => {
                return scope.setContext('Job', {
                    job: runningJob.id,
                });
            });
            return false;
        }

        // Prevent blocking queues from running if a job is already running
        if (runningJob && (runningJob.retry_count ?? 0) <= 0) {
            serverLogger(`Cannot process ${queueName} queue. A job is already running`, (scope) => {
                return scope.setContext('Job', {
                    job: runningJob.id,
                });
            });
            return false;
        }

        const jobs = await db(fetchJobs)({
            queue: queueName,
            status: payload?.status ?? JOB_STATUS.pending,
            limit: payload?.limit ?? 1,
        });
        const results: { job: string; result: boolean }[] = [];
        for (const job of jobs) {
            const jobResult = await runJob(job);

            // set status to pending if failed so that we can retry
            const status = jobResult.status === JOB_STATUS.success ? JOB_STATUS.success : JOB_STATUS.pending;
            await finishJob(job, status, jobResult.result);

            results.push({ job: job.id, result: jobResult.status === JOB_STATUS.success });
        }

        return results;
    },
};
