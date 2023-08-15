import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getInfluencerPostsBySocialProfile } from 'src/utils/api/db/calls/influencer-post';
import { db } from 'src/utils/supabase-client';
import type { PostInfo } from '../posts';

export type InfluencerPostResponse = PostInfo[] | { error: string };

// @note this fetches the influencer posts using the influencer_social_profiles.id
const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;

    if (!id) {
        return res.status(httpCodes.BAD_REQUEST).json({
            error: 'Invalid request',
        });
    }

    const _getInfluencerPostsBySocialProfile = db<typeof getInfluencerPostsBySocialProfile>(
        getInfluencerPostsBySocialProfile,
    );

    const posts = await _getInfluencerPostsBySocialProfile(id);

    const transformedPosts = posts.map((post) => {
        const { title, posted_date, id, url } = post;
        return {
            title: title || '',
            postedDate: posted_date || '',
            id,
            url,
            performance: null,
        };
    });

    return res.status(httpCodes.OK).json(transformedPosts);
};

export default ApiHandler({
    getHandler,
});
