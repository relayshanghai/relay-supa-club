import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { RelayDatabase } from './api/db';

export type DBQuery = (db: SupabaseClient<DatabaseWithCustomTypes> | RelayDatabase) => (...args: any) => any;

export type DBQueryReturn<T extends DBQuery> = Awaited<ReturnType<ReturnType<T>>>;

export type DBQueryParameters<T extends DBQuery> = Awaited<Parameters<ReturnType<T>>>;

export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};
