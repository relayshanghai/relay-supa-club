import { sequenceInfluencers, sequences, templateVariables, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull, sql } from 'drizzle-orm';

export type GetThreadsReturn = {
    threads: typeof threads.$inferSelect;
    sequence_influencers: typeof sequenceInfluencers.$inferSelect | null;
    sequences: typeof sequences.$inferSelect | null;
    template_variables: typeof templateVariables.$inferSelect | null;
}[];

type GetThreadsFn = (account: string) => Promise<GetThreadsReturn>;

export const getThreads: DBQuery<GetThreadsFn> = (i) => async (account: string) => {
    const rows = await db(i)
        .select()
        .from(threads)
        .where(and(eq(threads.emailEngineAccountId, account), isNull(threads.deletedAt)))
        .leftJoin(sequenceInfluencers, eq(sequenceInfluencers.id, threads.sequenceInfluencerId))
        .leftJoin(sequences, eq(sequences.id, sequenceInfluencers.sequenceId))
        .leftJoin(
            templateVariables,
            sql`${templateVariables.sequenceId} = ${sequences.id} AND ${templateVariables.key} = 'productName'`,
        );

    return rows;
};
