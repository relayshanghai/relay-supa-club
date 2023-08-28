import type { InfluencerPosts, RelayDatabase } from '../types';

export const insertInfluencerPost =
    (db: RelayDatabase) =>
    async (data: InfluencerPosts['Insert']): Promise<InfluencerPosts['Row']> => {
        const influencerPost = await db.from('influencer_posts').insert(data).select().single();

        if (influencerPost.error) {
            throw influencerPost.error;
        }

        return influencerPost.data;
    };

export const deleteInfluencerPost =
    (db: RelayDatabase) =>
    async (id: string): Promise<InfluencerPosts['Row'] | null> => {
        const influencerPost = await db
            .from('influencer_posts')
            .update({
                deleted_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .maybeSingle();

        if (influencerPost.error) {
            throw influencerPost.error;
        }

        return influencerPost.data;
    };

export const getInfluencerPostsBySocialProfile =
    (db: RelayDatabase) =>
    async (influencer_social_profile_id: string | null): Promise<InfluencerPosts['Row'][]> => {
        const influencerPost = await db
            .from('influencer_posts')
            .select()
            .eq('influencer_social_profile_id', influencer_social_profile_id)
            .is('deleted_at', null);

        if (influencerPost.error) {
            throw influencerPost.error;
        }

        return influencerPost.data;
    };
