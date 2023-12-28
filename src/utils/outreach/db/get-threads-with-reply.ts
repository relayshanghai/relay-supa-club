import { sequenceInfluencers, sequences, templateVariables, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull, sql, desc, isNotNull, inArray } from 'drizzle-orm';
import type { FilterType } from 'src/components/inbox/wip/filter';

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

type GetThreadsWithReplyByFilterFn = (account: string, filters?: FilterType) => Promise<GetThreadsWithReplyReturn>;

export const getThreadsWithReplyByFilter: DBQuery<GetThreadsWithReplyByFilterFn> =
    (i) => async (account: string, filters?: FilterType) => {
        const rows = await db(i)
            .select()
            .from(threads)
            .leftJoin(sequenceInfluencers, eq(sequenceInfluencers.id, threads.sequenceInfluencerId))
            .leftJoin(sequences, eq(sequences.id, sequenceInfluencers.sequenceId))
            .leftJoin(
                templateVariables,
                sql`${templateVariables.sequenceId} = ${sequences.id} AND ${templateVariables.key} = 'productName'`,
            )
            .where(
                and(
                    eq(threads.emailEngineAccountId, account),
                    isNull(threads.deletedAt),
                    isNotNull(threads.lastReplyId),
                    isNotNull(threads.sequenceInfluencerId),
                    filters && filters.funnelStatus.length > 0
                        ? inArray(sequenceInfluencers.funnelStatus, filters.funnelStatus)
                        : undefined,
                    filters && filters.threadStatus.length > 0
                        ? inArray(threads.threadStatus, filters.threadStatus)
                        : undefined,
                    filters && filters.sequences.length > 0
                        ? inArray(
                              sequences.id,
                              filters.sequences.map((sequence) => sequence.id),
                          )
                        : undefined,
                ),
            )
            .orderBy(desc(threads.updatedAt));

        return rows;
    };
