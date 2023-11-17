import httpCodes from 'src/constants/httpCodes';
import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { getJob } from 'src/utils/scheduler/db-queries';
import type { RunJobRequest } from 'src/utils/scheduler/types';
import { db } from 'src/utils/supabase-client';

const getHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        return res.status(httpCodes.UNAUTHORIZED).end();
    }

    const query = req.query as RunJobRequest['query'] & { id?: string };

    if (!query.id) {
        return res.status(httpCodes.NOT_FOUND).end();
    }

    const job = await db(getJob)(query.id, { owner: req.session.user.id });

    if (!job) {
        return res.status(httpCodes.NOT_FOUND).end();
    }

    return res.status(httpCodes.OK).json(job);
};

export default ApiHandler({
    getHandler,
});
