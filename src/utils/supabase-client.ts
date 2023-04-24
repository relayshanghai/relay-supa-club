/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY not set');

/** ***THIS SHOULD ONLY BE USED SERVER-SIDE*** */
export const supabase = createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey);
