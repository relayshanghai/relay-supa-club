/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import { DatabaseWithCustomTypes } from 'types';

const supabaseUrl = process.env.TEST_NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl) console.log('TEST_NEXT_PUBLIC_SUPABASE_URL not set');
const supabaseAnonKey = process.env.TEST_NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseAnonKey) console.log('TEST_NEXT_PUBLIC_SUPABASE_ANON_KEY not set');

const options: any = {};
console.log({
    supabaseUrl,
});
export const testSupabase = createClient<DatabaseWithCustomTypes>(
    supabaseUrl,
    supabaseAnonKey,
    options,
);
