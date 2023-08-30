import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createTrack } from 'src/utils/analytics/api/analytics';
import events, { eventKeys, isTrackedEvent } from 'src/utils/analytics/events';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import { getSearchSnapshot, insertSearchSnapshot, updateSearchSnapshot } from 'src/utils/api/db/calls/search-snapshots';
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
import { now } from 'src/utils/datetime';
import { db } from 'src/utils/supabase-client';
import { zType } from 'src/utils/zod';
import { z } from 'zod';

const PostRequestBody = z.object({
    event: eventKeys,
    event_at: z.string().optional().default(now),
    payload: z.object({
        event_id: z.string().optional(),
        snapshot_id: z.string().optional(),
        parameters: zType<FetchCreatorsFilteredParams>(),
    }),
});

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { event, event_at, payload } = PostRequestBody.parse(req.body);
    const { event_id, snapshot_id, ..._payload } = payload;
    let snapshot = null;
    const trackedEvent = events[event];

    if (!isTrackedEvent(trackedEvent)) {
        throw new RelayError('Cannot track event', 400);
    }

    const result = await createTrack({ req, res })(trackedEvent, { ..._payload, event_id, event_at });

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
