import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export const getInfluencerSocialProfileByIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (id: string) => {
        if (!id) return;
        const { data, error } = await supabaseClient
            .from('influencer_social_profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    };
