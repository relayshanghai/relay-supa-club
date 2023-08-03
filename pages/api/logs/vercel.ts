import { timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { VercelLog } from 'src/utils/api/db/calls/vercel-logs';
import { insertVercelLog } from 'src/utils/api/db/calls/vercel-logs';
import { toISO } from 'src/utils/datetime';
import { db } from 'src/utils/supabase-client';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const body: VercelLog[] = req.body;

    if (req.body === '{}') {
        return res
            .setHeader('x-vercel-verify', process.env.VERCEL_VERIFY_TOKEN ?? '')
            .status(httpCodes.OK)
            .json(null);
    }

    if (
        !timingSafeEqual(
            Buffer.from(String(req.headers['x-vercel-key']), 'utf-8'),
            Buffer.from(process.env.VERCEL_LOG_DRAIN_KEY ?? '', 'utf-8'),
        )
    ) {
        return res.status(httpCodes.FORBIDDEN).json(null);
    }

    body.forEach((item) => {
        const { id, message, type, source, deploymentId, timestamp } = item;

        db<typeof insertVercelLog>(insertVercelLog)({
            id,
            message,
            type,
            source,
            deployment_id: deploymentId,
            timestamp: toISO(timestamp),
            data: item,
        });
    });

    return res.status(httpCodes.NO_CONTENT);
};

export default ApiHandler({
    postHandler,
});
