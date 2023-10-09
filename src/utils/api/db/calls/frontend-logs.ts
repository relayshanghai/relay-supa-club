import type { LogsInsertDB } from '../types';

export type SupabaseLogType = 'stripe-webhook' | 'email-webhook' | 'login-bug';

export const supabaseLogger = (supabase: any) => (data: LogsInsertDB) =>
    supabase.from('logs').insert(data).select().single();
