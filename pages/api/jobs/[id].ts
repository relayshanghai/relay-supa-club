import type { ActionHandler } from 'src/utils/api-handler';
import { ApiHandler } from 'src/utils/api-handler';
import { getJob } from 'src/utils/scheduler/db';
import type { RunJobRequest } from 'src/utils/scheduler/types';
import { db } from 'src/utils/supabase-client';

const getHandler: ActionHandler = async (req, res) => {
    if (!req.session) {
        return res.status(401).end();
    }

    const query = req.query as RunJobRequest['query'] & { id?: string };

    if (!query.id) {
        return res.status(404).end();
    }

    const job = await db(getJob)(query.id);

    if (!job) {
        return res.status(404).end();
    }

    return res.status(200).json(job);
};

export default ApiHandler({
    getHandler,
});
