import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export const getProfileByIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (id: string, abortSignal?: AbortSignal) => {
        if (abortSignal) {
            return await supabaseClient.from('profiles').select().abortSignal(abortSignal).eq('id', id).single();
        }
        return await supabaseClient.from('profiles').select().eq('id', id).single();
    };
