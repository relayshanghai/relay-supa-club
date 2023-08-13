import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getBulkRelevantTopicTags } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';

const GetRelevantTopicsBody = z.object({
    topics: z.string().array(),
});

export type GetRelevantTopicsBody = z.input<typeof GetRelevantTopicsBody>;
export type GetRelevantTopicsResponse = { relevantTopics: string[] };

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const relevantTopics = await getBulkRelevantTopicTags(req.body.topics, { limit: 10, platform: 'instagram' });

    return res.status(httpCodes.OK).json({ relevantTopics });
};

export default ApiHandler({ postHandler });
