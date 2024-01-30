import type { NextApiRequest, NextApiResponse } from 'next';
import {
    getInfluencerSocialProfileTopicTags,
    saveInfluencerSocialProfileTopicTags,
} from 'src/backend/database/influencer-social-profiles';
import { BAD_REQUEST } from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';
import { createInfluencerReferenceId } from 'src/utils/api/iqdata/extract-influencer';
import type { GetRelevantTopicTagsResponse } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { getRelevantTopicTagsByInfluencer } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { serverLogger } from 'src/utils/logger-server';
import { IQDATA_GET_RELEVANT_TOPIC_TAGS, rudderstack } from 'src/utils/rudderstack';
import { z } from 'zod';

const topicTensorByUsernamePost = z.object({
    username: z.string(),
    limit: z.number().optional(),
    platform: z.enum(['tiktok', 'instagram', 'youtube']),
    /** iqdata user_profile.user_id */
    iqdata_id: z.string(),
});

export type TopicTensorByUsernamePost = z.infer<typeof topicTensorByUsernamePost>;

export type TopicTensorByUsernameResponse = GetRelevantTopicTagsResponse;

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const validated = topicTensorByUsernamePost.safeParse(req.body);

    if (!validated.success) {
        return res.status(BAD_REQUEST).json({ error: validated.error });
    }

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

    const { username, limit = 60, platform, iqdata_id } = validated.data;
    const referenceId = createInfluencerReferenceId(iqdata_id);

    const existingTags = await getInfluencerSocialProfileTopicTags()(referenceId);

    if (existingTags && Array.isArray(existingTags)) {
        return res.status(200).json(existingTags);
    }

    const results = await getRelevantTopicTagsByInfluencer({ query: { q: username, limit, platform } }, { req, res });

    if (!results.success) {
        return res.send([]);
    }
    const cleanedTopics = results.data.map((topic) => ({
        ...topic,
        distance: Number(topic.distance.toFixed(2)),
    }));

    try {
        await saveInfluencerSocialProfileTopicTags()(referenceId, cleanedTopics);
    } catch (error) {
        serverLogger(error);
    }
    return res.status(200).json({ success: true, data: cleanedTopics });
};

export default ApiHandlerWithContext({
    postHandler,
});
