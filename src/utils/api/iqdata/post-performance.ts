// This is really both IQData and Apify but because it mixes them together let's just put it here.
import { fetchInstagramPostInfo, fetchYoutubeVideoInfo as apifyFetchYoutubeVideoInfo } from 'src/utils/api/apify';
import type { PostPerformanceAndPost, PostsPerformanceUpdate } from 'src/utils/api/db';
import { getPostsPerformancesByCampaign, updatePostPerformance } from 'src/utils/api/db';
import { fetchTiktokVideoInfo, fetchYoutubeVideoInfo } from 'src/utils/api/iqdata';
import { serverLogger } from 'src/utils/logger-server';
import type { CreatorPlatform } from 'types';

export type PostPerformanceData = {
    id: string;
    platform: CreatorPlatform;
    url: string;
    updatedAt: string;
    likeCount?: number | null;
    commentCount?: number | null;
    viewCount?: number | null;
    sales?: number | null;
};

export const fetchPostPerformanceData = async (
    platform: CreatorPlatform,
    url?: string,
): Promise<Omit<PostPerformanceData, 'id'>> => {
    if (!url) {
        throw new Error('Invalid url');
    }
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
                platform,
                url,
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
            platform,
            url,
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
            platform,
            url,
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
            platform,
            url,
        };
    }
    throw new Error('Invalid platform');
};

export const transformPostPerformanceData = (raw: PostPerformanceAndPost): PostPerformanceData => {
    if (!raw.updated_at || !raw.id) {
        throw new Error('Invalid raw data');
    }
    const { likes_total, comments_total, views_total, sales_total, platform, updated_at, url, id } = raw;
    return {
        likeCount: likes_total,
        commentCount: comments_total,
        viewCount: views_total,
        sales: sales_total,
        updatedAt: updated_at,
        platform,
        url,
        id,
    };
};

export const getPostsPerformanceDataByCampaign = async (
    campaignId: string,
    profileId: string,
): Promise<PostPerformanceData[]> => {
    const existingPerformanceData = await getPostsPerformancesByCampaign(campaignId, profileId);

    // check each post's updated_at and async refresh all post data that is older than 1 day
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const oneDayAgo = new Date(now.getTime() - oneDay);

    existingPerformanceData.forEach(async (post: any) => {
        const { id, updated_at, platform, url } = post;
        if (!platform || !url || !updated_at || new Date(updated_at) < oneDayAgo) {
            try {
                const newPerformanceData = await fetchPostPerformanceData(platform, url);
                const updateData: PostsPerformanceUpdate = {
                    id,
                    likes_total: newPerformanceData.likeCount,
                    comments_total: newPerformanceData.commentCount,
                    views_total: newPerformanceData.viewCount,
                };
                updatePostPerformance(updateData);
            } catch (error) {
                serverLogger(error, 'error');
            }
        }
    });

    return existingPerformanceData.map(transformPostPerformanceData);
};
