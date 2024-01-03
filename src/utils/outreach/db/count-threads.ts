import { and, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';
import { sequence_influencers, sequences, template_variables, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import type { ThreadsFilter } from 'src/utils/endpoints/get-threads';

export type CountThreadsReturn = {
    thread_status: string;
    thread_status_total: number;
};

type CountThreadsFn = (account: string, filters?: ThreadsFilter) => Promise<CountThreadsReturn[]>;

export const countThreads: DBQuery<CountThreadsFn> = (i) => async (account: string, filters?: ThreadsFilter) => {
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

    const rows = await db(i)
        .select({
            thread_status: threads.thread_status,
            thread_status_total: sql<number>`cast(count(${threads.id}) as int)`,
        })
        .from(threads)
        .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
        .leftJoin(sequences, eq(sequences.id, sequence_influencers.sequence_id))
        .leftJoin(
            template_variables,
            sql`${template_variables.sequence_id} = ${sequences.id} AND ${template_variables.key} = 'productName'`,
        )
        .where(and(...queryFilters))
        .groupBy(threads.thread_status);

    return rows;
};
