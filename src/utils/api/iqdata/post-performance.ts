// This is really both IQData and Apify but because it mixes them together let's just put it here.
import type { PostPerformanceAndPost, PostsPerformanceUpdate } from 'src/utils/api/db';
import { getPostsPerformancesByCampaign, updatePostPerformance } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';
import { scrapeInstagramUrl } from 'src/utils/scraper/scrape-instagram-url';
import { scrapeTiktokUrl } from 'src/utils/scraper/scrape-tiktok-url';
import { scrapeYoutubeUrl } from 'src/utils/scraper/scrape-youtube-url';
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
        return await scrapeYoutubeUrl(url);
    }

    if (platform === 'tiktok') {
        return await scrapeTiktokUrl(url);
    }

    if (platform === 'instagram') {
        return await scrapeInstagramUrl(url);
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
