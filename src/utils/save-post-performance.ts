import type { PostsPerformanceInsert, RelayDatabase } from './api/db';
import { insertPostPerformance } from './api/db';

export const savePostPerformance = (db: RelayDatabase) => async (data: PostsPerformanceInsert) => {
    const result = await insertPostPerformance(db)(data);

    return result;
};
