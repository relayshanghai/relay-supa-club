import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler, RelayError } from 'src/utils/api-handler';
import { recordSearchUsage } from 'src/utils/api/db/calls/usages';
import { searchInfluencersWithContext as searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
import { prepareFetchCreatorsFiltered } from 'src/utils/api/iqdata/transforms';
import { hasCustomSearchParams } from 'src/utils/usagesHelpers';
import type { CreatorSearchResult } from 'types';
import { createSearchParameter, createSearchSnapshot } from 'src/utils/analytics/api/analytics';
import { v4 } from 'uuid';
import { db } from 'src/utils/supabase-client';
import { IQDATA_SEARCH_INFLUENCERS, rudderstack } from 'src/utils/rudderstack';

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

    await rudderstack.identify({ req, res });

    rudderstack.track({
        event: IQDATA_SEARCH_INFLUENCERS,
        onTrack: (data) => {
            if (data.total === undefined) return false;

            return {
                total: data.total,
                shown_accounts: data.shown_accounts,
                paid: true,
                cost: data.cost,
                platform,
                page: searchParams.page,
            };
        },
    });

    const results = await searchInfluencers(parameters, { req, res });

    if (results === undefined) {
        throw new RelayError('Cannot search influencers');
    }

    const parameter = await db<typeof createSearchParameter>(createSearchParameter)(parameters);

    const snapshot = await createSearchSnapshot(
        { req, res },
        {
            parameters_id: parameter.id,
            parameters,
            results,
        },
    );

    // @see /types/appTypes/SearchResultMetadata
    results.__metadata = {
        event_id: v4(),
        snapshot_id: snapshot.id,
        parameters_id: parameter.id,
    };

    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({
    postHandler,
});
