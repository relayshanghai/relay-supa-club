import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { getTopics } from 'src/utils/api/boostbot/get-topics';

const GetTopicsBody = z.object({
    productDescription: z.string(),
});

export type GetTopicsBody = z.input<typeof GetTopicsBody>;
export type GetTopicsResponse = { topics: string[] };

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const result = GetTopicsBody.safeParse(req.body);

    if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json(result.error.format());
    }

    const topics = await getTopics(result.data.productDescription);

    return res.status(httpCodes.OK).json({ topics });
};

export default ApiHandler({ postHandler });
