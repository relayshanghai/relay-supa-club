import type { NextApiHandler } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getInfluencerIdsFromSheet } from 'src/utils/google/recommended-influencers-sheet';
import { serverLogger } from 'src/utils/logger-server';

export type RecommendedInfluencersGetResponse = string[];

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    try {
        const influencers = await getInfluencerIdsFromSheet();
        return res.status(httpCodes.OK).json(influencers);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
};

export default handler;
