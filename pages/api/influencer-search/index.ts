import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { recordSearchUsage } from 'src/utils/api/db/calls/usages';
import { searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
import { prepareFetchCreatorsFiltered } from 'src/utils/api/iqdata/transforms';
import { hasCustomSearchParams } from 'src/utils/usagesHelpers';
import type { CreatorSearchResult } from 'types';

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

    const results = await searchInfluencers(
        { company_id, user_id },
        {
            query: { platform },
            body,
        },
    );

    return res.status(httpCodes.OK).json(results);
};

export default ApiHandler({
    postHandler,
});
