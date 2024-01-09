import { sequence_influencers, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull } from 'drizzle-orm';

type GetThreadReturn = {
    thread: typeof threads.$inferSelect;
    sequence_influencer: typeof sequence_influencers.$inferSelect | null;
};

type GetThreadFn = (threadId: string) => Promise<GetThreadReturn | null>;

export const getThread: DBQuery<GetThreadFn> = (i) => async (threadId: string) => {
    const rows = await db(i)
        .select()
        .from(threads)
        .where(and(eq(threads.thread_id, threadId), isNull(threads.deleted_at)))
        .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id));

    if (rows.length !== 1) return null;

    return {
        thread: rows[0].threads,
        sequence_influencer: rows[0].sequence_influencers,
    };
};