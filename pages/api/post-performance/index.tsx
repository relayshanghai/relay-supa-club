import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { fetchInstagramPostInfo, fetchYoutubeVideoInfo as apifyFetchYoutubeVideoInfo } from 'src/utils/api/apify';
import type { PostPerformanceAndPost, PostsPerformanceUpdate } from 'src/utils/api/db';
import { getPostsPerformancesByCampaign, updatePostPerformance } from 'src/utils/api/db';
import { fetchTiktokVideoInfo, fetchYoutubeVideoInfo } from 'src/utils/api/iqdata';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';
import type { CreatorPlatform } from 'types';

export type PostsPerformanceGetQuery = {
    campaignId: string;
    profileId: string;
};

export type PostPerformanceData = {
    likeCount?: number;
    commentCount?: number;
    viewCount?: number;
    updatedAt: string;
    sales?: number;
};
export type PostScrapeGetResponse = PostPerformanceData[];

const fetchPostPerformanceData = async (platform: CreatorPlatform, url: string): Promise<PostPerformanceData> => {
    if (platform === 'youtube') {
        // try to get from iqdata, if it fails, use apify
        try {
            const raw = await fetchYoutubeVideoInfo(url);
            if (!raw.success || !raw.video_info.likes) {
                throw new Error('unable to fetch youtube video info');
            }
            const { likes, comments, views } = raw.video_info;
            return {
                likeCount: likes,
                commentCount: comments,
                viewCount: views,
                updatedAt: new Date().toISOString(),
            };
        } catch (error) {
            serverLogger('error fetching youtube video info from iqdata, trying apify. url: ' + url, 'error');
            serverLogger(error, 'error');
        }

        const raw = await apifyFetchYoutubeVideoInfo(url);
        if (!raw[0]) {
            throw new Error('unable to fetch youtube video info');
        }
        const { likes, commentsCount, viewCount } = raw[0];
        return {
            likeCount: likes,
            commentCount: commentsCount,
            viewCount: viewCount,
            updatedAt: new Date().toISOString(),
        };
    } else if (platform === 'tiktok') {
        const raw = await fetchTiktokVideoInfo(url);
        if (!raw.media.itemInfo.itemStruct.stats) {
            throw new Error('unable to fetch tiktok video info');
        }
        const { diggCount, commentCount, playCount } = raw.media.itemInfo.itemStruct.stats;
        return {
            likeCount: diggCount,
            commentCount,
            viewCount: playCount,
            updatedAt: new Date().toISOString(),
        };
    } else if (platform === 'instagram') {
        const raw = await fetchInstagramPostInfo(url);
        if (!raw[0]) {
            throw new Error('unable to fetch instagram post info');
        }
        const { likesCount, commentsCount, videoPlayCount } = raw[0];
        return {
            likeCount: likesCount,
            commentCount: commentsCount,
            viewCount: videoPlayCount,
            updatedAt: new Date().toISOString(),
        };
    }
    throw new Error('Invalid platform');
};

const transformPostPerformanceData = (raw: PostPerformanceAndPost): PostPerformanceData => {
    if (!raw.updated_at) {
        throw new Error('Invalid raw data');
    }
    return {
        likeCount: raw.likes_total ?? undefined,
        commentCount: raw.comments_total ?? undefined,
        viewCount: raw.views_total ?? undefined,
        updatedAt: raw.updated_at,
        sales: raw.sales_total ?? undefined,
    };
};

const getPostPerformanceData = async (campaignId: string, profileId: string): Promise<PostPerformanceData[]> => {
    const existingPerformanceData = await getPostsPerformancesByCampaign(campaignId, profileId);

    // check each post's updated_at and async refresh all post data that is older than 1 day
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const oneDayAgo = new Date(now.getTime() - oneDay);

    existingPerformanceData.forEach(async (post: any) => {
        if (!post.updated_at || new Date(post.updated_at) < oneDayAgo) {
            if (!post.influencer_posts[0]) {
                return;
            }
            const platform = post.influencer_posts[0].platform;
            const url = post.influencer_posts[0].url;
            if (!platform || !url) {
                return;
            }
            const newPerformanceData = await fetchPostPerformanceData(platform, url);
            const updateData: PostsPerformanceUpdate = {
                id: post.id,
                likes_total: newPerformanceData.likeCount,
                comments_total: newPerformanceData.commentCount,
                views_total: newPerformanceData.viewCount,
            };
            try {
                updatePostPerformance(updateData);
            } catch (error) {
                serverLogger(error, 'error');
            }
        }
    });

    return existingPerformanceData.map(transformPostPerformanceData);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { campaignId, profileId } = req.query as PostsPerformanceGetQuery;
        if (!profileId) {
            return res.status(400).json({ error: 'Invalid request. Body must contain "profileId" property.' });
        }

        const matchesSession = await checkSessionIdMatchesID(profileId, req, res);
        if (!matchesSession) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: 'user is unauthorized for this action',
            });
        }

        const results = await getPostPerformanceData(campaignId, profileId);

        return res.status(httpCodes.OK).json(results);
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export default handler;
