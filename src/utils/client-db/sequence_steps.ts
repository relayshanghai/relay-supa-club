import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { SequenceStepUpdate } from '../api/db';

export const getSequenceStepsBySequenceIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (sequenceId: string) => {
        if (!sequenceId) return;
        const { data, error } = await supabaseClient.from('sequence_steps').select('*').eq('sequence_id', sequenceId);

        if (error) throw error;
        return data;
    };

export const updateSequenceStepCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (update: SequenceStepUpdate) => {
        const { data, error } = await supabaseClient.from('sequence_steps').update(update).eq('id', update.id).single();
        if (error) throw error;
        return data;
    };
