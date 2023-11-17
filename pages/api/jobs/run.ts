import httpCodes from 'src/constants/httpCodes';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { checkToken } from 'src/utils/check-token';
import type { RunJobRequest } from 'src/utils/scheduler/types';
import { JOB_STATUS, SCHEDULER_TOKEN_HEADER, SCHEDULER_TOKEN_KEY } from 'src/utils/scheduler/types';
import { initQueue } from 'src/utils/scheduler/queues';

const postHandler: ActionHandler = async (req, res) => {
    const query = (req.query ?? {}) as RunJobRequest['query'];
    const token = String(req.headers[SCHEDULER_TOKEN_HEADER] ?? '');

    if (!checkToken(token, SCHEDULER_TOKEN_KEY)) {
        return res.status(httpCodes.UNAUTHORIZED).end();
    }

    const { queue, status, limit } = { queue: 'default', status: JOB_STATUS.pending, limit: 1, ...query };

    const jobqueue = initQueue(queue);
    const results = await jobqueue.run({ status, limit });

    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({
    postHandler,
});
