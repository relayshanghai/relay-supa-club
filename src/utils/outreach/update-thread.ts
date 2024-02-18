import { and, eq } from 'drizzle-orm';
import { threads } from 'drizzle/schema';
import { db } from 'src/utils/database';
import type { UpdatableData } from '../endpoints/update-thread';

type UpdateThreadFn = (params: {
    account: string;
    threadId: string;
    data: UpdatableData;
}) => Promise<typeof threads.$inferSelect>;

export const updateThread: UpdateThreadFn = async (params) => {
    const row = await db()
        .update(threads)
        .set(params.data)
        .where(and(eq(threads.email_engine_account_id, params.account), eq(threads.thread_id, params.threadId)))
        .returning();

    if (row.length !== 1) throw new Error('Error in updating row');

    return row[0];
};
