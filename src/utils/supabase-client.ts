/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl) console.log('NEXT_PUBLIC_SUPABASE_URL not set');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseAnonKey) console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY not set');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
if (!supabaseServiceKey) console.log('SUPABASE_SERVICE_KEY not set');

/** ***THIS SHOULD ONLY BE USED SERVER-SIDE*** */
export const supabase = createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey);
