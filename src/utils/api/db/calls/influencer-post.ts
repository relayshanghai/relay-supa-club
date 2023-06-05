import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { InfluencerPostInsert, InfluencerPostRow } from '../types';

export const insertInfluencerPost =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: InfluencerPostInsert): Promise<InfluencerPostRow> => {
        const influencerPost = await db.from('influencer_posts').insert(data).select().single();

        if (influencerPost.error) {
            throw influencerPost.error;
        }

        return influencerPost.data;
    };

export const deleteInfluencerPost =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (id: string): Promise<InfluencerPostRow | null> => {
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
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (influencer_social_profile_id: string | null): Promise<InfluencerPostRow[]> => {
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
