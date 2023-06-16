import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { getRelevantTopicTags } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { term, platform, limit } = req.body;

    const results = await getRelevantTopicTags({
        query: { q: term, platform, limit },
    });

    return res.status(200).json(results);
};

export default ApiHandler({
    postHandler,
});
