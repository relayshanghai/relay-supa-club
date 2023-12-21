import { sequenceInfluencers, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull } from 'drizzle-orm';

type GetThreadReturn = {
    thread: typeof threads.$inferSelect;
    sequence_influencer: typeof sequenceInfluencers.$inferSelect | null;
};

type GetThreadFn = (threadId: string) => Promise<GetThreadReturn | null>;

export const getThread: DBQuery<GetThreadFn> = (i) => async (threadId: string) => {
    const rows = await db(i)
        .select()
        .from(threads)
        .where(and(eq(threads.threadId, threadId), isNull(threads.deletedAt)))
        .leftJoin(sequenceInfluencers, eq(sequenceInfluencers.id, threads.sequenceInfluencerId));

    if (rows.length !== 1) return null;

    return {
        thread: rows[0].threads,
        sequence_influencer: rows[0].sequence_influencers,
    };
};
