import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { SequenceEmailUpdate } from '../api/db';

export const getSequenceEmailsBySequenceCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (sequenceId: string) => {
        if (!sequenceId) return;
        const { data, error } = await supabaseClient.from('sequence_email').select('*').eq('sequence_id', sequenceId);

        if (error) throw error;
        return data;
    };

export const getSequenceEmailByMessageIdCall =
    (db: SupabaseClient<DatabaseWithCustomTypes>) => async (messageId: string) => {
        const { data, error } = await db.from('sequence_email').select('*').eq('message_id', messageId).single();
        if (error) throw error;
        return data;
    };

export const updateSequenceEmailCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (update: SequenceEmailUpdate) => {
        const { data, error } = await supabaseClient.from('sequence_email').update(update).eq('id', update.id).single();
        if (error) throw error;
        return data;
    };
