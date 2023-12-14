import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import { getRelevantTopicTagsByInfluencer } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { IQDATA_GET_RELEVANT_TOPIC_TAGS, rudderstack } from 'src/utils/rudderstack';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, limit = 60, platform } = req.body;

    await rudderstack.identify({ req, res });

    rudderstack.track({
        event: IQDATA_GET_RELEVANT_TOPIC_TAGS,
        onTrack: (data) => {
            if (!data.data) return false;

            return {
                username,
                platform,
                count: data.data.length,
            };
        },
    });

    const results = await getRelevantTopicTagsByInfluencer(
        {
            query: { q: username, limit, platform },
        },
        { req, res },
    );

    const cleanedTopics = results.data.map((topic) => ({
        tag: topic.tag,
        distance: Number(topic.distance.toFixed(2)),
    }));

    return res.status(200).json({ success: true, data: cleanedTopics });
};

export default ApiHandler({
    postHandler,
});
