import { db } from 'src/utils/supabase-client';
import { fetchJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';
import { maxExecutionTime } from 'src/utils/max-execution-time';
import { serverLogger } from 'src/utils/logger-server';

const QUEUE_NAME = 'default';

type JobResponse = {
    result: any;
    status: JOB_STATUS.success | JOB_STATUS.failed;
};
const isProperJobResponse = (response: unknown): response is JobResponse => {
    if (typeof response !== 'object' || response === null) {
        return false;
    }
    const { status, result } = response as JobResponse;
    if (typeof status !== 'string' || typeof result !== 'object' || result === null) {
        return false;
    }
    return true;
};

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
            /** matches the postgres http
             *  https://github.com/pramsey/pgsql-http
             */
            const maxRunTime = 1000 * 30; // 30 seconds

            let raceResult: JobResponse | undefined | string;
            try {
                raceResult = await maxExecutionTime(runJob(job), maxRunTime);
            } catch (error: any) {
                if (!error?.message?.includes('Job timed out')) {
                    serverLogger(error);
                }
                raceResult = 'Job timed out';
            }
            const res =
                raceResult instanceof Error || !isProperJobResponse(raceResult)
                    ? {
                          status: JOB_STATUS.failed,
                          result: JSON.stringify(raceResult),
                      }
                    : raceResult;
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
