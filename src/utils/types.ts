import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export type DBQuery<T extends (...args: any) => any> = (db: SupabaseClient<DatabaseWithCustomTypes>) => T;
