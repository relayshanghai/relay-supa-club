import { threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { now } from 'src/utils/datetime';
import { eq } from 'drizzle-orm';

type CreateThreadFn = (params: {
    threadId: string;
    emailEngineAccount: string;
    sequenceInfluencerId?: string | null;
    lastReplyId?: string | null;
    createdAt?: string | null;
}) => Promise<typeof threads.$inferSelect>;

export const createThread: DBQuery<CreateThreadFn> = (i) => async (params) => {
    const updateData: Partial<typeof threads.$inferInsert> = { updatedAt: now() };

    if (params.lastReplyId) {
        updateData.lastReplyId = params.lastReplyId;
    }

    let result = await db(i)
        .insert(threads)
        .values({
            threadId: params.threadId,
            sequenceInfluencerId: params.sequenceInfluencerId,
            emailEngineAccountId: params.emailEngineAccount,
            createdAt: params.createdAt,
        })
        .onConflictDoUpdate({
            target: threads.threadId,
            set: updateData,
        })
        .returning();

    if (result.length <= 0) {
        result = await db(i).select().from(threads).where(eq(threads.threadId, params.threadId)).limit(1);
    }

    if (result.length !== 1) {
        throw new Error('Error in inserting row' + result.length);
    }

    return result[0];
};
