import { eq } from 'drizzle-orm';
import { influencer_social_profiles } from 'drizzle/schema';
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

    if (result.length !== 1) throw new Error('Error selecting from influencer_social_profiles table.');

    return result[0].topic_tags as TopicTensorData[] | undefined | null;
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
