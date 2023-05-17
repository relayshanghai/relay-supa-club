import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { Database } from 'types/supabase';

export type InfluencerPostInsert = Database['public']['Tables']['influencer_posts']['Insert'];
export type InfluencerPostRow = Database['public']['Tables']['influencer_posts']['Row'];

export const insertInfluencerPost =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: InfluencerPostInsert): Promise<InfluencerPostRow> => {
        const influencerPost = await db.from('influencer_posts').insert(data).select();

        if (influencerPost.error) {
            throw influencerPost.error;
        }

        return influencerPost.data[0];
    };
