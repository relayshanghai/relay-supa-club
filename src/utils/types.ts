import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { RelayDatabase } from './api/db';

export type DBQuery = (db: SupabaseClient<DatabaseWithCustomTypes> | RelayDatabase) => (...args: any) => any;
