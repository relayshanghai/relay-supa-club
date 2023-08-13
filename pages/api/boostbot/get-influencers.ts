import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import type { CreatorSearchAccount } from 'types';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { bulkSearchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import { createBoostbotInfluencerPayload } from 'src/utils/api/boostbot';

const GetInfluencersBody = z.object({
    topicClusters: z.string().array().array(),
});

export type GetInfluencersBody = z.input<typeof GetInfluencersBody>;
export type GetInfluencersResponse = { influencers: CreatorSearchAccount[] };

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const influencerParams = req.body.topicClusters.map(createBoostbotInfluencerPayload);
    const influencers = await bulkSearchInfluencers(influencerParams);

    return res.status(httpCodes.OK).json({ influencers });
};

export default ApiHandler({ postHandler });
