import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import type { CreatorSearchAccount } from 'types';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { createBoostbotInfluencerPayload } from 'src/utils/api/boostbot';
import { bulkSearchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import { platform_enum } from 'src/utils/api/iqdata/influencers/search-influencers-payload';

const GetInfluencersBody = z.object({
    topicClusters: z.string().array().array(),
    platform: platform_enum,
});

export type GetInfluencersBody = z.input<typeof GetInfluencersBody>;
export type GetInfluencersResponse = { influencers: CreatorSearchAccount[] };

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { topicClusters, platform } = req.body;
    const influencerParams = topicClusters.map(createBoostbotInfluencerPayload(platform));
    const influencers = await bulkSearchInfluencers(influencerParams);

    return res.status(httpCodes.OK).json({ influencers });
};

export default ApiHandler({ postHandler });
