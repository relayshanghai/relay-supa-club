import { threads } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type CreateThreadFn = (params: {
    sequenceInfluencerId: string | null;
    threadId: string;
    emailEngineAccount: string;
    emailEngineId: string;
}) => Promise<typeof threads.$inferSelect>;

export const createThread: DBQuery<CreateThreadFn> = (i) => async (params) => {
    let result = await db(i)
        .insert(threads)
        .values({
            threadId: params.threadId,
            sequenceInfluencerId: params.sequenceInfluencerId,
            emailEngineAccountId: params.emailEngineAccount,
            emailEngineId: params.emailEngineId,
        })
        .onConflictDoNothing({ target: threads.threadId })
        .returning();

    if (result.length <= 0) {
        result = await db(i).select().from(threads).where(eq(threads.threadId, params.threadId)).limit(1);
    }

    if (result.length !== 1) throw new Error('Error in inserting row');

    return result[0];
};
