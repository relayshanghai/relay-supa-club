import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export const getInfluencerByIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (id: string) => {
        if (!id) return;
        const { data, error } = await supabaseClient.from('influencers').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    };
