import { eq } from 'drizzle-orm';
import { influencer_social_profiles } from 'drizzle/schema';
import type { TopicsAndRelevance } from 'src/utils/api/boostbot/get-topic-relevance';
import type { TopicTensorData } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { db, type DBQuery } from 'src/utils/database';

/** @param reference_id with iqdata: prefix e.g. iqdata:123 */
export const getInfluencerSocialProfileTopicTags: DBQuery<
    (reference_id: string) => Promise<TopicTensorData[] | undefined | null>
> = (databaseInstance) => async (reference_id) => {
    const result = await db(databaseInstance)
        .select({ topic_tags: influencer_social_profiles.topic_tags })
        .from(influencer_social_profiles)
        .where(eq(influencer_social_profiles.reference_id, reference_id))
        .limit(1);

    if (result.length !== 1) throw new Error('Error selecting topic_tags from influencer_social_profiles table.');

    return result[0].topic_tags as TopicTensorData[];
};

/** @param reference_id with iqdata: prefix e.g. iqdata:123 */
export const saveInfluencerSocialProfileTopicTags: DBQuery<
    (reference_id: string, topicTags: TopicTensorData[]) => Promise<void>
> = (databaseInstance) => async (reference_id, topicTags) => {
    await db(databaseInstance)
        .update(influencer_social_profiles)
        .set({ topic_tags: topicTags })
        .where(eq(influencer_social_profiles.reference_id, reference_id));
};

/** @param reference_id with iqdata: prefix e.g. iqdata:123 */
export const getInfluencerSocialProfileTopicsRelevances: DBQuery<
    (reference_id: string) => Promise<TopicsAndRelevance[] | undefined | null>
> = (databaseInstance) => async (reference_id) => {
    const result = await db(databaseInstance)
        .select({ topics_relevances: influencer_social_profiles.topics_relevances })
        .from(influencer_social_profiles)
        .where(eq(influencer_social_profiles.reference_id, reference_id))
        .limit(1);

    if (result.length !== 1)
        throw new Error('Error selecting topics_relevances from influencer_social_profiles table.');

    return result[0].topics_relevances as TopicsAndRelevance[];
};

/** @param reference_id with iqdata: prefix e.g. iqdata:123 */
export const saveInfluencerSocialProfileTopicsRelevances: DBQuery<
    (reference_id: string, topicsRelevances: TopicsAndRelevance[]) => Promise<void>
> = (databaseInstance) => async (reference_id, topicsRelevances) => {
    await db(databaseInstance)
        .update(influencer_social_profiles)
        .set({ topics_relevances: topicsRelevances })
        .where(eq(influencer_social_profiles.reference_id, reference_id));
};
