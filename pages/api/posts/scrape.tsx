import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { fetchInstagramPostInfo, fetchYoutubeVideoInfo as apifyFetchYoutubeVideoInfo } from 'src/utils/api/apify';
import { fetchTiktokVideoInfo, fetchYoutubeVideoInfo } from 'src/utils/api/iqdata';
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

const getPostScrapedData = async (platform: CreatorPlatform, url: string): Promise<PostScrapeGetResponse> => {
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
        };
    }
    throw new Error('Invalid platform');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { platform, url, profileId } = req.query as PostScrapeGetQuery;
        if (!platform || !url || !profileId)
            return res
                .status(400)
                .json({ error: 'Invalid request. Body must contain "platform", "url" and "profileId" properties.' });

        const matchesSession = await checkSessionIdMatchesID(profileId, req, res);
        if (!matchesSession) {
            return res.status(httpCodes.UNAUTHORIZED).json({
                error: 'user is unauthorized for this action',
            });
        }
        const result = await getPostScrapedData(platform, url);
        return res.status(httpCodes.OK).json(result);
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export default handler;
