import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getCampaignCreator } from 'src/utils/api/db/calls/campaign-creators';
import { updateCampaignCreator } from 'src/utils/api/db/calls/campaign-creators';
import type { ServerContext } from 'src/utils/api/iqdata';
import { serverLogger } from 'src/utils/logger-server';
import { saveInfluencerPost } from 'src/utils/save-influencer-post';
import { savePostPerformance } from 'src/utils/save-post-performance';
import { scrapeInfluencerPost } from 'src/utils/scrape-influencer-post';
import { db } from 'src/utils/supabase-client';

export type InfluencerPostRequestBody = {
    campaign_id: string;
    urls: string[];
    creator_id: string;
};

export type PostInfo = {
    title: string;
    postedDate: string;
    id: string;
    url: string;
    performance: any;
};

export type InfluencerPostPostResponse =
    | {
          successful: PostInfo[];
          failed: string[];
      }
    | {
          error: string;
      };

const processURL = async (url: string, campaign_id: string, creator_id: string, context?: ServerContext) => {
    const scrape = await scrapeInfluencerPost(url, context);

    const _savePostPerformance = db<typeof savePostPerformance>(savePostPerformance);
    const _saveInfluencerPost = db<typeof saveInfluencerPost>(saveInfluencerPost);
    const _updateCampaignCreator = db<typeof updateCampaignCreator>(updateCampaignCreator);
    const _getCampaignCreator = db<typeof getCampaignCreator>(getCampaignCreator);

    const creator = await _getCampaignCreator(creator_id);

    if (!creator) {
        throw new Error('Creator not found');
    }

    if (scrape.influencer_platform_id !== creator.creator_id) {
        throw new Error('URL influencer and provided influencer did not match');
    }

    // @note: link campaign_creators to influencer_social_profiles
    //        https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/416
    const updatedCreator = await _updateCampaignCreator(creator_id, {
        influencer_social_profiles_id: scrape.influencer.id,
    });

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

    return { post, performance, creator: updatedCreator };
};

const postHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<InfluencerPostPostResponse>) => {
    const data: InfluencerPostPostResponse = {
        successful: [],
        failed: [],
    };

    const body = req.body as InfluencerPostRequestBody;

    for (const url of body.urls) {
        try {
            const result = await processURL(url, body.campaign_id, body.creator_id, { req, res });

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
