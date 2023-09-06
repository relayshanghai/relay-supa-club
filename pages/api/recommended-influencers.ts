import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getInfluencerIdsFromSheet } from 'src/utils/google/recommended-influencers-sheet';
import { serverLogger } from 'src/utils/logger-server';

export type RecommendedInfluencersGetResponse = string[];

// TODO: add rate limiting or caching https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/329
const handler: NextApiHandler = async (req, res) => {
    if (process.env.NEXT_PUBLIC_CI === 'true') {
        return res.status(httpCodes.OK).json([]);
    }
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const influencers = await getInfluencerIdsFromSheet();
        return res.status(httpCodes.OK).json(influencers);
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default handler;
