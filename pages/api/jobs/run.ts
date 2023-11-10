import httpCodes from 'src/constants/httpCodes';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { checkToken } from 'src/utils/check-token';
import { getJobs } from 'src/utils/scheduler/db-queries';
import { runJob } from 'src/utils/scheduler/utils';
import type { RunJobRequest } from 'src/utils/scheduler/types';
import { JOB_QUEUE, JOB_STATUS, SCHEDULER_TOKEN_HEADER, SCHEDULER_TOKEN_KEY } from 'src/utils/scheduler/types';
import { db } from 'src/utils/supabase-client';

const postHandler: ActionHandler = async (req, res) => {
    const query = req.query as RunJobRequest['query'];
    const token = String(req.headers[SCHEDULER_TOKEN_HEADER] ?? '');

    if (!checkToken(token, SCHEDULER_TOKEN_KEY)) {
        return res.status(httpCodes.UNAUTHORIZED).end();
    }

    const { queue, status, limit } = query ?? {};

    const jobs = await db(getJobs)({
        queue: queue ?? JOB_QUEUE.default,
        status: status ?? JOB_STATUS.pending,
        limit: limit ?? 1,
    });

    const runningJobs = jobs.map((job) => runJob(job));
    const finishedJobs = await Promise.allSettled(runningJobs);
    const results: { job: string; result: boolean }[] = finishedJobs.map((result) =>
        result.status === 'fulfilled' ? result.value : result.reason,
    );

    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({
    postHandler,
});
