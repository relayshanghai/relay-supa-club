import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { SequenceUpdate } from '../api/db';

export const getSequencesByCompanyIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (companyId: string) => {
        if (!companyId) return;
        const { data, error } = await supabaseClient.from('sequences').select('*').eq('company_id', companyId);

        if (error) throw error;
        return data;
    };

export const getSequenceByIdCall = (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (id: string) => {
    const { data, error } = await supabaseClient.from('sequences').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
};

export const updateSequenceCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (update: SequenceUpdate) => {
        const { data, error } = await supabaseClient.from('sequences').update(update).eq('id', update.id).single();
        if (error) throw error;
        return data;
    };
