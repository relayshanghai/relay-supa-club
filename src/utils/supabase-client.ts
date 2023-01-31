/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import { DatabaseWithCustomTypes } from 'types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl) console.log('NEXT_PUBLIC_SUPABASE_URL not set');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseAnonKey) console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY not set');

const options: any = {};

/** ***THIS SHOULD ONLY BE USE SERVER-SIDE*** */
export const supabase = createClient<DatabaseWithCustomTypes>(
    supabaseUrl,
    supabaseAnonKey,
    options,
);
