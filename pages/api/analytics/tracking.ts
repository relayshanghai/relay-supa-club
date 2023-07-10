import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { z } from 'zod';
import { now } from 'src/utils/datetime';
import { createTrack } from 'src/utils/analytics/api/analytics';
import { JsonRoot } from 'src/utils/json';
import events, { eventKeys } from 'src/utils/analytics/events';

const PostRequestBody = z.object({
    event: eventKeys,
    event_at: z.string().optional().default(now),
    payload: JsonRoot,
});

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { event, event_at, payload } = PostRequestBody.parse(req.body);

    const result = createTrack({ req, res })(events[event], { ...payload, event_at });

    return res.status(httpCodes.OK).json(result);
};

export default ApiHandler({
    postHandler,
});
