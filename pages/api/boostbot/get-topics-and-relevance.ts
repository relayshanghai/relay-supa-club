import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getTopicsAndRelevance } from 'src/utils/api/boostbot/get-topic-relevance';

const GetTopicsAndRelevanceBody = z.object({
    topics: z
        .object({
            tag: z.string(),
            distance: z.number(),
        })
        .array(),
});

export type GetTopicsAndRelevanceBody = z.input<typeof GetTopicsAndRelevanceBody>;
export type GetTopicsAndRelevanceResponse = {
    topic_en: string;
    topic_zh: string;
    relevance: number;
}[];

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetTopicsAndRelevanceBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const { topics } = result.data;
    const topicsAndRelevance: GetTopicsAndRelevanceResponse = await getTopicsAndRelevance(topics);

    return res.status(httpCodes.OK).json(topicsAndRelevance);
};

export default ApiHandler({ postHandler });
