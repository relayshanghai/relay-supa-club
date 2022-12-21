/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl) console.log('NEXT_PUBLIC_SUPABASE_URL not set');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseAnonKey) console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY not set');

const options: any = {};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
