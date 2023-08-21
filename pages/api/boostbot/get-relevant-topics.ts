import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getBulkRelevantTopicTags } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { platform_enum } from 'src/utils/api/iqdata/influencers/search-influencers-payload';

const GetRelevantTopicsBody = z.object({
    topics: z.string().array(),
    platform: platform_enum,
});

export type GetRelevantTopicsBody = z.input<typeof GetRelevantTopicsBody>;
export type GetRelevantTopicsResponse = { relevantTopics: string[] };

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { topics, platform } = req.body;
    const relevantTopics = await getBulkRelevantTopicTags(topics, { limit: 10, platform });

    return res.status(httpCodes.OK).json({ relevantTopics });
};

export default ApiHandler({ postHandler });
