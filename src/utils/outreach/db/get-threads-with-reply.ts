import { sequenceInfluencers, sequences, templateVariables, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull, sql, desc, isNotNull } from 'drizzle-orm';

export type GetThreadsWithReplyReturn = {
    threads: typeof threads.$inferSelect;
    sequence_influencers: typeof sequenceInfluencers.$inferSelect | null;
    sequences: typeof sequences.$inferSelect | null;
    template_variables: typeof templateVariables.$inferSelect | null;
}[];

type GetThreadsWithReplyFn = (account: string) => Promise<GetThreadsWithReplyReturn>;

export const getThreadsWithReply: DBQuery<GetThreadsWithReplyFn> = (i) => async (account: string) => {
    const rows = await db(i)
        .select()
        .from(threads)
        .where(
            // @todo I really should think of a better way for this now..
            and(eq(threads.emailEngineAccountId, account), isNull(threads.deletedAt), isNotNull(threads.lastReplyId)),
        )
        .leftJoin(sequenceInfluencers, eq(sequenceInfluencers.id, threads.sequenceInfluencerId))
        .leftJoin(sequences, eq(sequences.id, sequenceInfluencers.sequenceId))
        .leftJoin(
            templateVariables,
            sql`${templateVariables.sequenceId} = ${sequences.id} AND ${templateVariables.key} = 'productName'`,
        )
        .orderBy(desc(threads.updatedAt));

    return rows;
};
