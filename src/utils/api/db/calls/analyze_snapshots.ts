import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { AnalyzeSnapshots } from '../types';

// @todo move out here
type RelayDatabase = SupabaseClient<DatabaseWithCustomTypes>;

export const insertAnalyzeSnapshot = (db: RelayDatabase) => async (data: AnalyzeSnapshots['Insert']) => {
    const result = await db.from('analyze_snapshots').insert(data).select().single();
    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const updateAnalyzeSnapshot = (db: RelayDatabase) => async (data: AnalyzeSnapshots['Update'], id: string) => {
    const result = await db.from('analyze_snapshots').update(data).eq('id', id).select().single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const getAnalyzeSnapshot = (db: RelayDatabase) => async (id: string) => {
    const result = await db.from('analyze_snapshots').select().eq('id', id).maybeSingle();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};
