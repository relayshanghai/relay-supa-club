import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import type { CreatorSearchAccount } from 'types';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { bulkSearchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import { getTopics } from 'src/utils/api/boostbot/get-topics';
import { getTopicClusters } from 'src/utils/api/boostbot/get-topic-clusters';
import { getBulkRelevantTopicTags } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { createBoostbotInfluencerPayload } from 'src/utils/api/boostbot';

const BoostbotSearchBody = z.object({
    message: z.string(),
});

export type BoostbotSearchBody = z.input<typeof BoostbotSearchBody>;
export type BoostbotSearchResponse = {
    message: string;
    influencers: CreatorSearchAccount[];
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const productDescription = req.body.message;
    const initialTopics = await getTopics(productDescription);
    const initialRelatedTopics = await getBulkRelevantTopicTags(initialTopics, { limit: 10, platform: 'instagram' });
    const topicClusters = await getTopicClusters(productDescription, initialRelatedTopics);
    const influencerParams = topicClusters.map(createBoostbotInfluencerPayload);
    const influencers = await bulkSearchInfluencers(influencerParams);

    const response = {
        message: 'TODO: format topics output for FE',
        influencers,
    };

    return res.status(httpCodes.OK).json(response);
};

export default ApiHandler({ postHandler });
