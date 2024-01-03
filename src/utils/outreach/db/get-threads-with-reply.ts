import { sequence_influencers, sequences, template_variables, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull, sql, desc, isNotNull, inArray } from 'drizzle-orm';
import type { FilterType } from 'src/components/inbox/wip/filter';

export type GetThreadsWithReplyReturn = {
    threads: typeof threads.$inferSelect;
    sequence_influencers: typeof sequence_influencers.$inferSelect | null;
    sequences: typeof sequences.$inferSelect | null;
    template_variables: typeof template_variables.$inferSelect | null;
};

type GetThreadsWithReplyFn = (account: string) => Promise<GetThreadsWithReplyReturn[]>;

export const getThreadsWithReply: DBQuery<GetThreadsWithReplyFn> = (i) => async (account: string) => {
    const rows = await db(i)
        .select()
        .from(threads)
        .where(
            // @todo I really should think of a better way for this now..
            and(
                eq(threads.email_engine_account_id, account),
                isNull(threads.deleted_at),
                isNotNull(threads.last_reply_id),
            ),
        )
        .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
        .leftJoin(sequences, eq(sequences.id, sequence_influencers.sequence_id))
        .leftJoin(
            template_variables,
            sql`${template_variables.sequence_id} = ${sequences.id} AND ${template_variables.key} = 'productName'`,
        )
        .orderBy(desc(threads.updated_at));

    return rows;
};

type GetThreadsWithReplyByFilterFn = (account: string, filters?: FilterType) => Promise<GetThreadsWithReplyReturn[]>;

export const getThreadsWithReplyByFilter: DBQuery<GetThreadsWithReplyByFilterFn> =
    (i) => async (account: string, filters?: FilterType) => {
        const queryFilters = [
            eq(threads.email_engine_account_id, account),
            isNull(threads.deleted_at),
            isNotNull(threads.last_reply_id),
            isNotNull(threads.sequence_influencer_id),
        ];

        if (filters && filters.funnelStatus && filters.funnelStatus.length > 0) {
            queryFilters.push(inArray(sequence_influencers.funnel_status, filters.funnelStatus));
        }

        if (filters && filters.threadStatus && filters.threadStatus.length > 0) {
            queryFilters.push(inArray(threads.thread_status, filters.threadStatus));
        }

        if (filters && filters.sequences && filters.sequences.length > 0) {
            queryFilters.push(
                inArray(
                    sequences.id,
                    filters.sequences.map((sequence) => sequence.id),
                ),
            );
        }

        if (filters && filters.threadIds && filters.threadIds.length > 0) {
            queryFilters.push(inArray(threads.thread_id, filters.threadIds));
        }

        const rows = await db(i)
            .select()
            .from(threads)
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
            .leftJoin(sequences, eq(sequences.id, sequence_influencers.sequence_id))
            .leftJoin(
                template_variables,
                sql`${template_variables.sequence_id} = ${sequences.id} AND ${template_variables.key} = 'productName'`,
            )
            .where(and(...queryFilters))
            .orderBy(desc(threads.updated_at));

        return rows;
    };
