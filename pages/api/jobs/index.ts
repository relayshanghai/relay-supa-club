import httpCodes from 'src/constants/httpCodes';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { createJob } from 'src/utils/scheduler/jobs';
import type { CreateJobRequest } from 'src/utils/scheduler/types';
import { JOB_QUEUE } from 'src/utils/scheduler/types';

const postHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        return res.status(httpCodes.UNAUTHORIZED).end();
    }

    const body = req.body ?? ({} as CreateJobRequest['body']);

    if (!body.queue) {
        body.queue = JOB_QUEUE.default;
    }

    const job = await createJob({
        name: body.name,
        run_at: body.run_at,
        payload: body.payload,
        queue: body.queue,
        owner: req.session.user.id,
    });

    return res.status(httpCodes.OK).json(job);
};

export default ApiHandler({
    postHandler,
});
