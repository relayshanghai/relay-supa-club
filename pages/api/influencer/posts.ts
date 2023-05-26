import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';
import { saveInfluencerPost } from 'src/utils/save-influencer-post';
import { savePostPerformance } from 'src/utils/save-post-performance';
import { scrapeInfluencerPost } from 'src/utils/scrape-influencer-post';
import { db } from 'src/utils/supabase-client';

export type InfluencerPostRequestBody = {
    campaign_id: string;
    urls: string[];
};

type PostInfo = {
    title: string;
    postedDate: string;
    id: string;
    url: string;
    performance: any;
};

export type InfluencerPostResponse =
    | {
          successful: PostInfo[];
          failed: string[];
      }
    | {
          error: string;
      };

const processURL = async (url: string, campaign_id: string) => {
    const scrape = await scrapeInfluencerPost(url);

    const _savePostPerformance = db<typeof savePostPerformance>(savePostPerformance);
    const _saveInfluencerPost = db<typeof saveInfluencerPost>(saveInfluencerPost);

    const post = await _saveInfluencerPost({
        type: '',
        campaign_id: campaign_id,
        influencer_social_profile_id: scrape.influencer.id,
        url: url,
        posted_date: scrape.postedAt,
        title: scrape.title,
        preview_url: scrape.preview_url,
        description: scrape.description,
    });

    const performance = await _savePostPerformance({
        campaign_id: campaign_id,
        influencer_social_profile_id: scrape.influencer.id,
        post_id: post.id,
        likes_total: scrape.likeCount,
        comments_total: scrape.commentCount,
        views_total: scrape.viewCount,
    });

    return { post, performance };
};

const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<InfluencerPostResponse>) => {
    const data: InfluencerPostResponse = {
        successful: [],
        failed: [],
    };

    const body = req.body as InfluencerPostRequestBody;
    // console.log({ body });
    for (const url of body.urls) {
        try {
            const result = await processURL(url, body.campaign_id);
            // console.log({ result });
            data.successful.push({
                title: result.post.title || '',
                postedDate: result.post.posted_date || '',
                id: result.post.id,
                url: result.post.url,
                performance: result.performance,
            });
        } catch (error) {
            serverLogger(error);
            data.failed.push(url);
        }
    }

    res.status(httpCodes.OK).json(data);
};

export default ApiHandler({
    postHandler,
});
