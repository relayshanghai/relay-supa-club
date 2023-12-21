import { threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';
import { now } from 'src/utils/datetime';

type DeleteThreadFn = (threadId: string) => Promise<typeof threads.$inferSelect | null>;

export const deleteThread: DBQuery<DeleteThreadFn> = (i) => async (threadId: string) => {
    const rows = await db(i)
        .update(threads)
        .set({ deletedAt: now() })
        .where(eq(threads.threadId, threadId))
        .returning();

    if (rows.length !== 1) return null;

    return rows[0];
};
