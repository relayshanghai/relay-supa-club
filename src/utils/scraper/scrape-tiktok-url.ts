import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTiktokVideoInfo as iqdataFetchTiktokVideoInfo } from '../api/iqdata';
import type { ScrapeData } from './types';

export const scrapeTiktokUrl = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    url: string,
): Promise<ScrapeData> => {
    const result = await iqdataFetchTiktokVideoInfo(context, url);

    if (!result.media.itemInfo.itemStruct.stats) {
        throw new Error('unable to fetch tiktok video info');
    }

    const { desc, createTime } = result.media.itemInfo.itemStruct;
    const { id } = result.media.itemInfo.itemStruct.author;
    const { cover } = result.media.itemInfo.itemStruct.video;
    const { diggCount, commentCount, playCount } = result.media.itemInfo.itemStruct.stats;

    return {
        likeCount: diggCount,
        commentCount,
        viewCount: playCount,
        updatedAt: new Date().toISOString(),
        postedAt: new Date(createTime).toISOString(),
        platform: 'tiktok',
        url,
        influencer: id,
        title: desc,
        preview_url: cover,
        __raw: result,
    };
};
