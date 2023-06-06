import type { DatabaseWithCustomTypes } from 'types';
import type { PostsPerformanceInsert } from './api/db';
import { insertPostPerformance } from './api/db';
import type { SupabaseClient } from '@supabase/supabase-js';

export const savePostPerformance =
    (db: SupabaseClient<DatabaseWithCustomTypes>) => async (data: PostsPerformanceInsert) => {
        const result = await insertPostPerformance(db)(data);

        return result;
    };
