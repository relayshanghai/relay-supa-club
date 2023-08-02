import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { SequenceInfluencerUpdate } from '../api/db';

export const getSequenceInfluencerByIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (id: string) => {
        if (!id) {
            throw new Error('No id provided');
        }
        const { data, error } = await supabaseClient.from('sequence_influencers').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    };

export const getSequenceInfluencersBySequenceIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (sequenceId: string) => {
        if (!sequenceId) {
            throw new Error('No sequenceId provided');
        }
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
            .select()
            .single();
        if (error) throw error;
        return data;
    };
