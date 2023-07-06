import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { recordSearchUsage } from 'src/utils/api/db/calls/usages';
import { searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
import { prepareFetchCreatorsFiltered } from 'src/utils/api/iqdata/transforms';
import { hasCustomSearchParams } from 'src/utils/usagesHelpers';
import type { CreatorSearchResult } from 'types';
import { insertTrackingEvent } from 'src/utils/api/db/calls/tracking_events';
import { db } from 'src/utils/supabase-client';
import type { TrackingEvents } from 'src/utils/api/db/types';
import { getJourney } from 'src/utils/analytics/api/journey';
import type { JourneyObject } from 'src/utils/analytics/types';
import type { zinfer } from 'src/utils/zod';
import { toISO } from 'src/utils/datetime';

export type InfluencerPostRequest = FetchCreatorsFilteredParams & {
    company_id: string;
    user_id: string;
};
export type InfluencerPostResponse = CreatorSearchResult;

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { company_id, user_id, ...searchParams } = req.body as InfluencerPostRequest;

    if (!company_id || !user_id) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }

    if (hasCustomSearchParams(searchParams)) {
        const { error: recordError } = await recordSearchUsage(company_id, user_id);

        if (recordError) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
        }
    }

    const { platform, body } = prepareFetchCreatorsFiltered(searchParams);

    const parameters = {
        query: { platform },
        body,
    };

    const results = await searchInfluencers(parameters);

    const journey = getJourney({ req, res });

    type SearchEventParam = Omit<TrackingEvents['Insert'], 'data'> & {
        data: {
            journey: zinfer<typeof JourneyObject, 'o'>;
            parameters: any;
        };
    };

    // anonymous_id?: string | null
    // company_id?: string | null
    // created_at?: string | null
    // data?: Json | null
    // event: string
    // event_at?: string | null
    // id: string
    // journey_id?: string | null
    // journey_type?: string | null
    // profile_id?: string | null
    // session_id?: string | null
    // user_id?: string | null

    const SearchEvent = async (params: SearchEventParam) => {
        const _insertTrackingEvent = db<typeof insertTrackingEvent>(insertTrackingEvent);
        await _insertTrackingEvent({ ...params });
    };

    if (journey) {
        await SearchEvent({
            event: 'search',
            event_at: toISO(journey.created_at),
            journey_id: journey.id,
            journey_type: journey.name,
            data: {
                journey,
                parameters,
            },
        });
        // createSearchSnapshot({
        //     parameters,
        //     results
        // })
    }

    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({
    postHandler,
});
