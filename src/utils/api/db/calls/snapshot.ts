import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { TrackingEvents } from '../types';

// @todo move out here
type RelayDatabase = SupabaseClient<DatabaseWithCustomTypes>;

export const insertSnapshot = (db: RelayDatabase) => async (data: TrackingEvents['Insert']) => {
    const result = await db.from('analyze_snapshots').insert(data).select().single();
    if (result.error) {
        throw result.error;
    }

    return result.data;
};
