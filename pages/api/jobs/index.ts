import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { createJob } from 'src/utils/scheduler/db';
import type { CreateJobRequest } from 'src/utils/scheduler/types';
import { JOB_QUEUE } from 'src/utils/scheduler/types';
import { db } from 'src/utils/supabase-client';
import { v4 } from 'uuid';

const postHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        return res.status(401).end();
    }

    const body = req.body ?? ({} as CreateJobRequest['body']);

    if (!body.queue) {
        body.queue = JOB_QUEUE.default;
    }

    const job = await db(createJob)(v4(), {
        name: body.name,
        run_at: body.run_at,
        payload: body.payload,
        queue: body.queue,
        owner: req.session.user.id,
    });

    return res.status(200).json(job);
};

export default ApiHandler({
    postHandler,
});
