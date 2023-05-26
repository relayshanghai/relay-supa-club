import { fetchTiktokVideoInfo as iqdataFetchTiktokVideoInfo } from '../api/iqdata';
import type { ScrapeData } from './types';

export const scrapeTiktokUrl = async (url: string): Promise<ScrapeData> => {
    const result = await iqdataFetchTiktokVideoInfo(url);

    if (!result.media.itemInfo.itemStruct.stats) {
        throw new Error('unable to fetch tiktok video info');
    }

    const { createTime } = result.media.itemInfo.itemStruct;
    const { id } = result.media.itemInfo.itemStruct.author;
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
        __raw: result,
    };
};
