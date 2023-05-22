import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { PostPerformanceData } from 'src/utils/api/iqdata/post-performance';
import { getPostsPerformanceDataByCampaign } from 'src/utils/api/iqdata/post-performance';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';

export type PostsPerformanceByCampaignGetQuery = {
    campaignId: string;
    profileId: string;
};

export type PostsPerformanceByCampaignGetResponse = PostPerformanceData[];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { campaignId, profileId } = req.query as PostsPerformanceByCampaignGetQuery;
        if (!profileId) {
            return res.status(400).json({ error: 'Invalid request. Body must contain "profileId" property.' });
        }

        const matchesSession = await checkSessionIdMatchesID(profileId, req, res);
        if (!matchesSession) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: 'user is unauthorized for this action',
            });
        }

        const results: PostsPerformanceByCampaignGetResponse = await getPostsPerformanceDataByCampaign(
            campaignId,
            profileId,
        );

        return res.status(httpCodes.OK).json(results);
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default handler;
