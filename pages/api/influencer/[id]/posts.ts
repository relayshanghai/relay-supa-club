import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getCampaignCreator } from 'src/utils/api/db/calls/campaign-creators';
import { getInfluencerPostsBySocialProfile } from 'src/utils/api/db/calls/influencer-post';
import { db } from 'src/utils/supabase-client';
import type { PostInfo } from '../posts';

export type InfluencerPostResponse = PostInfo[] | { error: string };

const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const campaignCreatorId = req.query.id as string;

    if (!campaignCreatorId) {
        return res.status(httpCodes.BAD_REQUEST).json({
            error: 'Invalid request',
        });
    }

    const _getCampaignCreator = db<typeof getCampaignCreator>(getCampaignCreator);
    const _getInfluencerPostsBySocialProfile = db<typeof getInfluencerPostsBySocialProfile>(
        getInfluencerPostsBySocialProfile,
    );

    const creator = await _getCampaignCreator(campaignCreatorId);

    if (!creator) {
        return res.status(httpCodes.NOT_FOUND).json({
            error: 'Not found',
        });
    }

    const posts = await _getInfluencerPostsBySocialProfile(creator.influencer_social_profiles_id);

    const transformedPosts = posts.map((post) => {
        const { title, posted_date, id, url } = post;
        return {
            title: title || '',
            postedDate: posted_date || '',
            id,
            url,
        };
    });

    return res.status(httpCodes.OK).json(transformedPosts);
};

export default ApiHandler({
    getHandler,
});
