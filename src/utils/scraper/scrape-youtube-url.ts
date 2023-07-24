import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchYoutubeVideoInfoWithContext as iqdataFetchYoutubeVideoInfo } from '../api/iqdata';
import type { ScrapeData } from './types';

export const scrapeYoutubeUrl = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    url: string,
): Promise<ScrapeData> => {
    const result = await iqdataFetchYoutubeVideoInfo(context, url);

    if (!result.success || !result.video_info.likes) {
        throw new Error('unable to fetch youtube video info');
    }

    const { likes, comments, views, channel_id, published_at, title, thumbnail, description } = result.video_info;

    return {
        likeCount: likes,
        commentCount: comments,
        viewCount: views,
        updatedAt: new Date().toISOString(),
        postedAt: published_at,
        platform: 'youtube',
        url,
        influencer: channel_id,
        title,
        preview_url: thumbnail,
        description,
        __raw: result,
    };
};
