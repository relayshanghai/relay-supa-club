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
export type GetTopicClustersResponse = string[][];

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetTopicClustersBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { productDescription, topics } = result.data;
    const topicClusters: GetTopicClustersResponse = await getTopicClusters(productDescription, topics);

    return res.status(httpCodes.OK).json(topicClusters);
};

export default ApiHandler({ postHandler });
