import { threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';
import { now } from 'src/utils/datetime';

type DeleteThreadFn = (threadId: string) => Promise<typeof threads.$inferSelect | null>;

export const deleteThread: DBQuery<DeleteThreadFn> = (drizzlePostgresInstance) => async (threadId: string) => {
    const rows = await db(drizzlePostgresInstance)
        .update(threads)
        .set({ deleted_at: now() })
        .where(eq(threads.thread_id, threadId))
        .returning();

    if (rows.length !== 1) return null;

    return rows[0];
};
