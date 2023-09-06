import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import type { InfluencerSocialProfileRow } from 'src/utils/api/db';
import { getInfluencerSocialProfileByReferenceId } from 'src/utils/api/db/calls/influencers-no-client';
import { fetchReport } from 'src/utils/api/iqdata/fetch-report';
import { serverLogger } from 'src/utils/logger-server';
import { saveInfluencer } from 'src/utils/save-influencer';
import { db } from 'src/utils/supabase-client';
import type { CreatorPlatform } from 'types';

type RequestQuery = {
    platform: CreatorPlatform;
    platform_id: string;
};

type ResponseBody = { data: InfluencerSocialProfileRow } | { error: string };

const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<ResponseBody>) => {
    const query = req.query as RequestQuery;
    const { platform, platform_id } = query;

    const socialProfile = await getInfluencerSocialProfileByReferenceId(`iqdata:${platform_id}`);

    if (socialProfile) {
        return res.status(httpCodes.OK).json({ data: socialProfile });
    }

    const report = await fetchReport(platform_id, platform, { req, res });

    if (!report) {
        serverLogger(`Cannot fetch report for influencer: ${platform_id}, ${platform}`);
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid Request' });
    }

    const [_, newSocialProfile] = await db<typeof saveInfluencer>(saveInfluencer)(report);

    if (newSocialProfile === null) {
        serverLogger(`Cannot save influencer: ${platform_id}, ${platform}`);
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid Request' });
    }

    res.status(httpCodes.OK).json({ data: newSocialProfile });
};

export default ApiHandler({
    getHandler,
});
