import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { getJobs } from 'src/utils/scheduler/jobs';
import type { RunJobRequest } from 'src/utils/scheduler/types';
import { JOB_QUEUE } from 'src/utils/scheduler/types';
import { JOB_STATUS } from 'src/utils/scheduler/types';
import { db } from 'src/utils/supabase-client';

const postHandler: ActionHandler = async (req, res) => {
    const query = req.query as RunJobRequest['query'];

    const { queue, status, limit } = query ?? {};

    const jobs = await db(getJobs)({
        queue: queue ?? JOB_QUEUE.default,
        status: status ?? JOB_STATUS.pending,
        limit: limit ?? 1,
    });

    return res.status(200).json(jobs);
};

export default ApiHandler({
    getHandler: postHandler,
});
