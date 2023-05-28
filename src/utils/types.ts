import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export type DBQuery<T extends (db: SupabaseClient<DatabaseWithCustomTypes>) => any> = (
    db: SupabaseClient<DatabaseWithCustomTypes>,
) => (...args: Parameters<ReturnType<T>>) => ReturnType<ReturnType<T>>;
