import { threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';
import { now } from 'src/utils/datetime';

type DeleteThreadByEmailIdFn = (emailId: string) => Promise<typeof threads.$inferSelect | null>;

export const deleteThreadByEmailId: DBQuery<DeleteThreadByEmailIdFn> = (i) => async (emailId: string) => {
    const rows = await db(i)
        .update(threads)
        .set({ deletedAt: now() })
        .where(eq(threads.emailEngineId, emailId))
        .returning();

    if (rows.length !== 1) return null;

    return rows[0];
};
