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
export type GetRelevantTopicsResponse = string[];

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetRelevantTopicsBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { topics, platform } = result.data;
    const relevantTopics: GetRelevantTopicsResponse = await getBulkRelevantTopicTags(topics, { limit: 10, platform });

    return res.status(httpCodes.OK).json(relevantTopics);
};

export default ApiHandler({ postHandler });
