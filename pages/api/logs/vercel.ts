import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { VercelLog } from 'src/utils/api/db/calls/vercel-logs';
import { insertVercelLog } from 'src/utils/api/db/calls/vercel-logs';
import { db } from 'src/utils/supabase-client';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const body: VercelLog[] = req.body;

    body.forEach((item) => {
        const { id, message, type, source, deployment_id, timestamp } = item;

        db<typeof insertVercelLog>(insertVercelLog)({
            id,
            message,
            type,
            source,
            deployment_id,
            timestamp,
            data: item,
        });
    });

    return res.setHeader('x-vercel-verify', process.env.VERCEL_VERIFY_TOKEN ?? '').status(httpCodes.OK);
};

export default ApiHandler({
    postHandler,
});
