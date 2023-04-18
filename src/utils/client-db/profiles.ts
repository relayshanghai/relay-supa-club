import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export const getProfileByIdCall = (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (id: string) =>
    await supabaseClient.from('profiles').select().eq('id', id).single();
