import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { TrackingEvents } from '../types';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

// @todo move out here
type RelayDatabase = SupabaseClient<DatabaseWithCustomTypes>;
// @todo use profiles since user.id is profiles.id too
type AuthUser = Exclude<Awaited<ReturnType<SupabaseAuthClient['getUser']>>['data']['user'], null>;

export const insertTrackingEvent = (db: RelayDatabase) => async (data: TrackingEvents['Insert']) => {
    const result = await db.from('tracking_events').insert(data).select().single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const getProfileByUser = (db: RelayDatabase) => async (user: AuthUser) => {
    const result = await db.from('profiles').select().eq('id', user.id).single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};
