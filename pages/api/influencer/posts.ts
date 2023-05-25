import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { saveInfluencerPost as saveInfluencerPostQuery } from 'src/utils/save-influencer-post';
import { db } from 'src/utils/supabase-client';

export type RecommendedInfluencersGetResponse = string[];

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

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<PostResponse>) => {
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
            error: 'method not allowed',
        });
    }

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

export default handler;
