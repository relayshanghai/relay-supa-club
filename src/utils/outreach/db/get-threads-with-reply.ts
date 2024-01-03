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
};

type GetThreadsWithReplyFn = (account: string) => Promise<GetThreadsWithReplyReturn[]>;

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

type GetThreadsWithReplyByFilterFn = (account: string, filters?: FilterType) => Promise<GetThreadsWithReplyReturn[]>;

export const getThreadsWithReplyByFilter: DBQuery<GetThreadsWithReplyByFilterFn> =
    (i) => async (account: string, filters?: FilterType) => {
        const queryFilters = [
            eq(threads.emailEngineAccountId, account),
            isNull(threads.deletedAt),
            isNotNull(threads.lastReplyId),
            isNotNull(threads.sequenceInfluencerId),
        ];

        if (filters && filters.funnelStatus && filters.funnelStatus.length > 0) {
            queryFilters.push(inArray(sequenceInfluencers.funnelStatus, filters.funnelStatus));
        }

        if (filters && filters.threadStatus && filters.threadStatus.length > 0) {
            queryFilters.push(inArray(threads.threadStatus, filters.threadStatus));
        }

        if (filters && filters.sequences && filters.sequences.length > 0) {
            queryFilters.push(
                inArray(
                    sequences.id,
                    filters.sequences.map((sequence) => sequence.id),
                ),
            );
        }

        const rows = await db(i)
            .select()
            .from(threads)
            .leftJoin(sequenceInfluencers, eq(sequenceInfluencers.id, threads.sequenceInfluencerId))
            .leftJoin(sequences, eq(sequences.id, sequenceInfluencers.sequenceId))
            .leftJoin(
                templateVariables,
                sql`${templateVariables.sequenceId} = ${sequences.id} AND ${templateVariables.key} = 'productName'`,
            )
            .where(and(...queryFilters))
            .orderBy(desc(threads.updatedAt));

        return rows;
    };
