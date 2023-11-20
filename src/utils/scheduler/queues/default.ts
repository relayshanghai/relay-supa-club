import { db } from 'src/utils/supabase-client';
import { fetchJobs } from '../db-queries';
import type { JobQueue } from '../types';
import { JOB_STATUS } from '../types';
import { finishJob, runJob } from '../utils';

const QUEUE_NAME = 'default';

type JobResponse = {
    result: any;
    status: JOB_STATUS.success | JOB_STATUS.failed;
};
const isProperJobResponse = (response: unknown): response is JobResponse => {
    if (typeof response !== 'object' || response === null) return false;
    const { status, result } = response as JobResponse;
    if (typeof status !== 'string' || typeof result !== 'object' || result === null) return false;
    return true;
};

export const useMaxExecutionTime = async (func: () => Promise<any>, maxTime: number) => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Job timed out'));
        }, maxTime);
    });
    return await Promise.race([func, timeout]);
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
            const maxRunTime = 1000 * 60 * 3; // 3 minutes
            const raceResult = await useMaxExecutionTime(async () => await runJob(job), maxRunTime);

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
