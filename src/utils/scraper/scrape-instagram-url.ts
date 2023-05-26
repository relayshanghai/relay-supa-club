import { fetchInstagramPostInfo as apifyFetchInstagramPostInfo } from '../api/apify';
import type { ScrapeData } from './types';

export const scrapeInstagramUrl = async (url: string): Promise<ScrapeData> => {
    const result = await apifyFetchInstagramPostInfo(url);

    if (!result[0]) {
        throw new Error('unable to fetch instagram post info');
    }

    const { likesCount, commentsCount, videoPlayCount, ownerId, timestamp } = result[0];

    return {
        likeCount: likesCount,
        commentCount: commentsCount,
        viewCount: videoPlayCount,
        updatedAt: new Date().toISOString(),
        postedAt: timestamp,
        platform: 'instagram',
        url,
        influencer: ownerId,
        __raw: result,
    };
};
