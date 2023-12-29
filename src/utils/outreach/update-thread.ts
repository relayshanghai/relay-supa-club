import { eq } from 'drizzle-orm';
import { threads } from 'drizzle/schema';
import { db } from 'src/utils/database';

type UpdatableData = Pick<typeof threads.$inferInsert, 'threadStatus'>;

type UpdateThreadFn = (params: { threadId: string; data: UpdatableData }) => Promise<typeof threads.$inferSelect>;

export const updateThread: UpdateThreadFn = async (params) => {
    const row = await db().update(threads).set(params.data).where(eq(threads.threadId, params.threadId)).returning();

    if (row.length !== 1) throw new Error('Error in updating row');

    return row[0];
};
