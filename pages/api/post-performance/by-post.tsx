import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getPostsPerformance } from 'src/utils/api/db';
import type { PostPerformanceData } from 'src/utils/api/iqdata/post-performance';
import { transformPostPerformanceData } from 'src/utils/api/iqdata/post-performance';

import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';

export type PostsPerformanceByPostGetQuery = {
    id: string;
    profileId: string;
};

export type PostsPerformanceByPostGetResponse = PostPerformanceData;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { id, profileId } = req.query as PostsPerformanceByPostGetQuery;
        if (!profileId) {
            return res.status(400).json({ error: 'Invalid request. Body must contain "profileId" property.' });
        }

        const matchesSession = await checkSessionIdMatchesID(profileId, req, res);
        if (!matchesSession) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: 'user is unauthorized for this action',
            });
        }
        const postPerformance = await getPostsPerformance(id);
        const results: PostsPerformanceByPostGetResponse = transformPostPerformanceData(postPerformance);

        return res.status(httpCodes.OK).json(results);
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default handler;
