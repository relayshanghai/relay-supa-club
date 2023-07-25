import type { AuthUser } from '@supabase/supabase-js';
import type { RelayDatabase } from '../types';

export const getProfileByUser = (db: RelayDatabase) => async (user: AuthUser) => {
    const result = await db.from('profiles').select().eq('id', user.id).single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};
