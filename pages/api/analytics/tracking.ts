import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { z } from 'zod';
import { now } from 'src/utils/datetime';
import { createTrack } from 'src/utils/analytics/api/analytics';
import { JsonRoot } from 'src/utils/json';
import events, { eventKeys } from 'src/utils/analytics/events';
import { db } from 'src/utils/supabase-client';
import { getSearchSnapshot, insertSearchSnapshot, updateSearchSnapshot } from 'src/utils/api/db/calls/search_snapshots';

const PostRequestBody = z.object({
    snapshot_id: z.string().optional(),
    event: eventKeys,
    event_at: z.string().optional().default(now),
    payload: JsonRoot,
});

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { snapshot_id, event, event_at, payload } = PostRequestBody.parse(req.body);
    let snapshot = null;

    const result = await createTrack({ req, res })(events[event], { ...payload, event_at });

    // @todo move to copySnapshot
    if (snapshot_id) {
        const _snapshot = await db<typeof getSearchSnapshot>(getSearchSnapshot)(snapshot_id);

        if (_snapshot !== null && _snapshot.event_id !== null) {
            const { id: _id, ...data } = _snapshot;
            data.event_id = result.id;

            snapshot = await db<typeof insertSearchSnapshot>(insertSearchSnapshot)(data);
        }

        if (_snapshot !== null && _snapshot.event_id === null) {
            snapshot = await db<typeof updateSearchSnapshot>(updateSearchSnapshot)(
                { event_id: result.id },
                snapshot_id,
            );
        }
    }

    return res.status(httpCodes.OK).json({
        result,
        snapshot,
    });
};

export default ApiHandler({
    postHandler,
});
