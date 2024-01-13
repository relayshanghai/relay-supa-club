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

export const createThread: DBQuery<CreateThreadFn> = (drizzlePostgresInstance) => async (params) => {
    const updateData: Partial<typeof threads.$inferInsert> = { updated_at: now() };

    if (params.lastReplyId) {
        updateData.last_reply_id = params.lastReplyId;
    }

    if (params.sequenceInfluencerId) {
        updateData.sequence_influencer_id = params.sequenceInfluencerId;
    }

    let result = await db(drizzlePostgresInstance)
        .insert(threads)
        .values({
            thread_id: params.threadId,
            sequence_influencer_id: params.sequenceInfluencerId,
            email_engine_account_id: params.emailEngineAccount,
            created_at: params.createdAt,
        })
        .onConflictDoUpdate({
            target: threads.thread_id,
            set: updateData,
        })
        .returning();

    if (result.length <= 0) {
        result = await db(drizzlePostgresInstance)
            .select()
            .from(threads)
            .where(eq(threads.thread_id, params.threadId))
            .limit(1);
    }

    if (result.length !== 1) {
        throw new Error('Error in inserting row');
    }

    return result[0];
};
