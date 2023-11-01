/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { DBQuery } from './types';
import { isPostgrestError, normalizePostgrestError } from 'src/errors/postgrest-error';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY not set');

/** ***THIS SHOULD ONLY BE USED SERVER-SIDE*** */
export const supabase = createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
});

export const db = <T extends DBQuery>(query: T) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        throw new Error('Supabase URL or service key is not set');
    }

    const supabase = createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
    });

    const q = async (...args: Parameters<ReturnType<T>>) => {
        try {
            return await query(supabase)(...args);
        } catch (error) {
            if (isPostgrestError(error)) {
                error = normalizePostgrestError(error);
            }
            throw error;
        }
    };

    return q as ReturnType<T>;
};
