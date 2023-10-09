import { supabase } from 'src/utils/supabase-client';
import type { LogsInsertDB } from '../types';

export type SupabaseLogType = 'stripe-webhook' | 'email-webhook' | 'login-bug';

export const supabaseLogger = (data: LogsInsertDB) => supabase.from('logs').insert(data).select().single();
