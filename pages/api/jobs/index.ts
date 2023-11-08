import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import type { DateInterval } from 'src/utils/datetime';
import { addTime, now } from 'src/utils/datetime';
import { createJob } from 'src/utils/scheduler/jobs';
import type { CreateJobRequest } from 'src/utils/scheduler/types';
import { JOB_QUEUE } from 'src/utils/scheduler/types';
import { db } from 'src/utils/supabase-client';
import { v4 } from 'uuid';

const postHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        return res.status(401).end();
    }

    const body = req.body as CreateJobRequest['body'];

    if (!body.queue) {
        body.queue = JOB_QUEUE.default;
    }

    // @note temporary
    const interval: [number, DateInterval] = [1, 'minutes'];
    body.run_at = addTime(now(), interval[0], interval[1]).toISOString();

    const job = await db(createJob)(v4(), {
        name: body.name,
        owner: req.session.user.id,
        run_at: body.run_at,
    });

    return res.status(200).json(job);
};

export default ApiHandler({
    getHandler: postHandler,
});
