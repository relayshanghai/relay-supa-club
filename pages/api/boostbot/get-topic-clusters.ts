import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getTopicClusters } from 'src/utils/api/boostbot/get-topic-clusters';

const GetTopicClustersBody = z.object({
    productDescription: z.string(),
    topics: z.string().array(),
});

export type GetTopicClustersBody = z.input<typeof GetTopicClustersBody>;
export type GetTopicClustersResponse = { topicClusters: string[][] };

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { productDescription, topics } = req.body;
    const topicClusters = await getTopicClusters(productDescription, topics);

    return res.status(httpCodes.OK).json({ topicClusters });
};

export default ApiHandler({ postHandler });
