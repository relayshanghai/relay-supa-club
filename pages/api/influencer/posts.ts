import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { saveInfluencerPost as saveInfluencerPostQuery } from 'src/utils/save-influencer-post';
import { db } from 'src/utils/supabase-client';

type PostRequest = {
    campaign_id: string;
    influencer_social_profile_id: string;
    urls: string[];
};

type PostInfo = {
    title: string;
    postedDate: string;
    id: string;
    url: string;
};

type PostResponse =
    | {
          successful: PostInfo[];
          failed: string[];
      }
    | {
          error: string;
      };

const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<PostResponse>) => {
    const data: PostResponse = {
        successful: [],
        failed: [],
    };

    const body = req.body as PostRequest;

    const saveInfluencerPost = db<typeof saveInfluencerPostQuery>(saveInfluencerPostQuery);

    for (const url in body.urls) {
        const post = await saveInfluencerPost({
            type: '',
            campaign_id: body.campaign_id,
            influencer_social_profile_id: body.influencer_social_profile_id,
            url: url,
        });

        data.successful.push({
            title: post.title || '',
            postedDate: post.posted_date || '',
            id: post.id,
            url: post.url,
        });
    }

    res.status(httpCodes.OK).json(data);
};

export default ApiHandler({
    postHandler,
});
