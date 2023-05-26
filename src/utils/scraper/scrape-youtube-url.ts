import { fetchYoutubeVideoInfo as iqdataFetchYoutubeVideoInfo } from '../api/iqdata';
import type { ScrapeData } from './types';

export const scrapeYoutubeUrl = async (url: string): Promise<ScrapeData> => {
    const result = await iqdataFetchYoutubeVideoInfo(url);

    if (!result.success || !result.video_info.likes) {
        throw new Error('unable to fetch youtube video info');
    }

    const { likes, comments, views, channel_id, published_at } = result.video_info;

    return {
        likeCount: likes,
        commentCount: comments,
        viewCount: views,
        updatedAt: new Date().toISOString(),
        postedAt: published_at,
        platform: 'youtube',
        url,
        influencer: channel_id,
        __raw: result,
    };
};
