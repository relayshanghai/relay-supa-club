import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { fetchInstagramPostInfo, fetchYoutubeVideoInfo } from 'src/utils/api/apify';
import { fetchTiktokVideoInfo } from 'src/utils/api/iqdata';
import { checkSessionIdMatchesID } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';
import type { CreatorPlatform } from 'types';

export type PostScrapeGetQuery = {
    platform: CreatorPlatform;
    url: string;
    profileId: string;
};

export type PostScrapeGetResponse = {
    likeCount?: number;
    commentCount?: number;
    viewCount?: number;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { platform, url, profileId } = req.query as PostScrapeGetQuery;
        if (!platform || !url || !profileId) return res.status(400).json({ error: 'Invalid request' });

        const matchesSession = await checkSessionIdMatchesID(profileId, req, res);
        if (!matchesSession) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: 'user is unauthorized for this action',
            });
        }

        if (platform === 'youtube') {
            const raw = await fetchYoutubeVideoInfo(url);
            const stats = raw[0];
            if (!stats) {
                throw new Error('unable to fetch youtube video info');
            }
            const result: PostScrapeGetResponse = {
                likeCount: stats.likes,
                commentCount: stats.commentsCount,
                viewCount: stats.viewCount,
            };
            return res.status(httpCodes.OK).json(result);
        } else if (platform === 'tiktok') {
            const raw = await fetchTiktokVideoInfo(url);
            const stats = raw.media.itemInfo.itemStruct.stats;
            const result: PostScrapeGetResponse = {
                likeCount: stats.diggCount,
                commentCount: stats.commentCount,
                viewCount: stats.playCount,
            };
            return res.status(httpCodes.OK).json(result);
        } else if (platform === 'instagram') {
            const raw = await fetchInstagramPostInfo(url);
            const stats = raw[0];
            if (!stats) {
                throw new Error('unable to fetch instagram post info');
            }
            const result: PostScrapeGetResponse = {
                likeCount: stats.likesCount,
                commentCount: stats.commentsCount,
                viewCount: stats.videoPlayCount,
            };
            return res.status(httpCodes.OK).json(result);
        }
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid platform' });
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export default handler;
