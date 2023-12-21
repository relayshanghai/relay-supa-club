import { sequenceInfluencers, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, desc, eq, isNull } from 'drizzle-orm';

type GetThreadsReturn = {
    threads: typeof threads.$inferSelect;
    sequence_influencers: typeof sequenceInfluencers.$inferSelect | null;
}[];

type GetThreadsFn = (account: string) => Promise<GetThreadsReturn>;

export const getThreads: DBQuery<GetThreadsFn> = (i) => async (account: string) => {
    const rows = await db(i)
        .select()
        .from(threads)
        .where(and(eq(threads.emailEngineAccountId, account), isNull(threads.deletedAt)))
        .leftJoin(sequenceInfluencers, eq(sequenceInfluencers.id, threads.sequenceInfluencerId))
        .orderBy(desc(threads.updatedAt));

    return rows;
};
