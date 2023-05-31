import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export type DBQuery<T extends (db: SupabaseClient<D>) => any, D = DatabaseWithCustomTypes> = (
    db: SupabaseClient<D>,
) => (...args: Parameters<ReturnType<T>>) => ReturnType<ReturnType<T>>;
