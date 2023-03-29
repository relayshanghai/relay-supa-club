import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { recordSearchUsage } from 'src/utils/api/db/calls/usages';
import { fetchCreatorsFiltered } from 'src/utils/api/iqdata';
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
import { serverLogger } from 'src/utils/logger-server';
import type { CreatorSearchResult } from 'types';

export type InfluencerPostRequest = FetchCreatorsFilteredParams & {
    company_id: string;
    user_id: string;
};
export type InfluencerPostResponse = CreatorSearchResult;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { company_id, user_id, ...searchParams } = req.body as InfluencerPostRequest;

            const { error: recordError } = await recordSearchUsage(company_id, user_id);
            if (recordError) {
                res.status(httpCodes.NOT_FOUND).json({ error: recordError });
            }

            const results = await fetchCreatorsFiltered(searchParams);

            return res.status(httpCodes.OK).json(results);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
