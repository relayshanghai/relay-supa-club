import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { getRelevantTopicTags } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { IQDATA_GET_RELEVANT_TOPIC_TAGS, rudderstack } from 'src/utils/rudderstack';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { term, limit, platform } = req.body;

    await rudderstack.identify({ req, res });

    rudderstack.track({
        event: IQDATA_GET_RELEVANT_TOPIC_TAGS,
        onTrack: (data) => {
            if (!data.data) return false;

            return {
                term,
                platform,
                count: data.data.length,
            };
        },
    });

    const results = await getRelevantTopicTags(
        {
            query: { q: term, limit, platform },
        },
        { req, res },
    );

    return res.status(200).json(results);
};

export default ApiHandler({
    postHandler,
});
