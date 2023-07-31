import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { SequenceInfluencerUpdate } from '../api/db';

export const getSequenceInfluencersBySequenceIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (sequenceId: string) => {
        if (!sequenceId) return;
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .select('*')
            .eq('sequence_id', sequenceId);

        if (error) throw error;
        return data;
    };

export const updateSequenceInfluencerCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (update: SequenceInfluencerUpdate) => {
        const { data, error } = await supabaseClient
            .from('sequence_influencers')
            .update(update)
            .eq('id', update.id)
            .single();
        if (error) throw error;
        return data;
    };
