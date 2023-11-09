import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import type { Jobs } from 'src/utils/api/db';
import { checkToken } from 'src/utils/check-token';
import { serverLogger } from 'src/utils/logger-server';
import { finishJob, getJobs } from 'src/utils/scheduler/db';
import { runJob } from 'src/utils/scheduler/jobs/index';
import type { RunJobRequest } from 'src/utils/scheduler/types';
import { SCHEDULER_TOKEN_HEADER, SCHEDULER_TOKEN_KEY } from 'src/utils/scheduler/types';
import { JOB_QUEUE } from 'src/utils/scheduler/types';
import { JOB_STATUS } from 'src/utils/scheduler/types';
import { db } from 'src/utils/supabase-client';

const handler = async (job: Jobs['Row']) => {
    try {
        const result = await runJob(job.name, job.payload);
        db(finishJob)(job, JOB_STATUS.success, result);
        return { job: job.id, result: true };
    } catch (e) {
        serverLogger(e);
        db(finishJob)(job, JOB_STATUS.failed, { error: new Error(String(e)).message });
        return { job: job.id, result: false };
    }
};

const postHandler: ActionHandler = async (req, res) => {
    const query = req.query as RunJobRequest['query'];
    const token = String(req.headers[SCHEDULER_TOKEN_HEADER] ?? '');

    if (!checkToken(token, SCHEDULER_TOKEN_KEY)) {
        return res.status(401).end();
    }

    const { queue, status, limit } = query ?? {};

    const jobs = await db(getJobs)({
        queue: queue ?? JOB_QUEUE.default,
        status: status ?? JOB_STATUS.pending,
        limit: limit ?? 1,
    });

    const runningJobs = jobs.map((job) => handler(job));
    const finishedJobs = await Promise.allSettled(runningJobs);
    const results: { job: string; result: boolean }[] = finishedJobs.map((result) =>
        result.status === 'fulfilled' ? result.value : result.reason,
    );

    return res.status(200).json(results);
};

export default ApiHandler({
    postHandler,
});
