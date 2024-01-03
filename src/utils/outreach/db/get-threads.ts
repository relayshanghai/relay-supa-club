import { sequence_influencers, sequences, template_variables, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull, sql, desc } from 'drizzle-orm';

export type GetThreadsReturn = {
    threads: typeof threads.$inferSelect;
    sequence_influencers: typeof sequence_influencers.$inferSelect | null;
    sequences: typeof sequences.$inferSelect | null;
    template_variables: typeof template_variables.$inferSelect | null;
}[];

type GetThreadsFn = (account: string) => Promise<GetThreadsReturn>;

export const getThreads: DBQuery<GetThreadsFn> = (i) => async (account: string) => {
    const rows = await db(i)
        .select()
        .from(threads)
        .where(and(eq(threads.email_engine_account_id, account), isNull(threads.deleted_at)))
        .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
        .leftJoin(sequences, eq(sequences.id, sequence_influencers.sequence_id))
        .leftJoin(
            template_variables,
            sql`${template_variables.sequence_id} = ${sequences.id} AND ${template_variables.key} = 'productName'`,
        )
        .orderBy(desc(threads.updated_at));

    return rows;
};
