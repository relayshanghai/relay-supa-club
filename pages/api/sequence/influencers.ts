import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { default as httpCodes } from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { Addresses, SequenceInfluencer } from 'src/utils/api/db';
import { getSequenceInfluencers } from 'src/utils/api/db/calls/get-sequence-influencers';
import { db } from 'src/utils/supabase-client';
import type { SearchTableInfluencer } from 'types';

export type SequenceInfluencerManagerPage = SequenceInfluencer & {
    manager_first_name?: string;
    address?: Addresses['Update'] | null;
    recent_post_title: string;
    recent_post_url: string;
    channel_data?: any;
};

export type SequenceInfluencerManagerPageWithChannelData = SequenceInfluencerManagerPage & {
    channel_data: SearchTableInfluencer;
};

const postHandler: NextApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<SequenceInfluencerManagerPage[]>,
) => {
    const sequenceIds: string[] = req.body;
    const influencers = await db(getSequenceInfluencers)(sequenceIds);
    return res.status(httpCodes.OK).json(
        influencers.map((i) => ({
            ...i,
            channel_data: i.channel_data && {
                url: i.channel_data.url,
                user_id: i.channel_data.user_id,
                handle: i.channel_data.handle,
                custom_name: i.channel_data.custom_name,
                fullname: i.channel_data.fullname,
                picture: i.channel_data.picture,
                username: i.channel_data.username,
                avg_views: i.channel_data.avg_views,
                avg_reels_plays: i.channel_data.avg_reels_plays,
                engagement_rate: i.channel_data.engagement_rate,
                posts_count: i.channel_data.posts_count,
                followers: i.channel_data.followers,
                followers_growth: i.channel_data.followers_growth,
                engagements: i.channel_data.engagements,
                relevance: i.channel_data.relevance,
                audience_genders_per_age: i.channel_data.audience_genders_per_age,
                audience_genders: i.channel_data.audience_genders,
                influencer_niche_graph: i.channel_data.influencer_niche_graph,
                iqdata_id: i.channel_data.iqdata_id,
            },
        })),
    );
};

export const config = {
    api: {
        responseLimit: '32mb',
    },
};

export default ApiHandler({ postHandler });
