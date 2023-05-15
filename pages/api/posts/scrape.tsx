import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { fetchTiktokVideoInfo, fetchYoutubeVideoInfo } from 'src/utils/api/iqdata';
import type { CreatorPlatform } from 'types';

export type PostScrapeGetQuery = {
    platform: CreatorPlatform;
    url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const { platform, url } = req.query as PostScrapeGetQuery;
        if (!platform || !url) return res.status(400).json({ error: 'Invalid request' });

        if (platform === 'youtube') {
            const result = await fetchYoutubeVideoInfo(url);

            return res.status(httpCodes.OK).json(result);
        } else if (platform === 'tiktok') {
            const result = await fetchTiktokVideoInfo(url);

            return res.status(httpCodes.OK).json(result);
        }
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid request' });
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export default handler;
