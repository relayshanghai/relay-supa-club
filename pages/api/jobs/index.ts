import httpCodes from 'src/constants/httpCodes';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { createJob } from 'src/utils/scheduler/utils';
import type { CreateJobRequest } from 'src/utils/scheduler/types';

const postHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        return res.status(httpCodes.UNAUTHORIZED).end();
    }

    const body = (req.body ?? {}) as CreateJobRequest['body'];

    if (!body.queue) {
        body.queue = 'default';
    }

    const job = await createJob(body.name, {
        run_at: body.run_at,
        payload: body.payload as any,
        queue: body.queue,
        owner: req.session.user.id,
    });

    if (!job) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed creating the job',
        });
    }

    return res.status(httpCodes.OK).json(job);
};

export default ApiHandler({
    postHandler,
});
