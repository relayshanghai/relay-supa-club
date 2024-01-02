import { and, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';
import { sequenceInfluencers, sequences, templateVariables, threads } from 'drizzle/schema';
import type { FilterType } from 'src/components/inbox/wip/filter';
import type { DBQuery } from '../../database';
import { db } from '../../database';

export type CountThreadsReturn = {
    threadStatus: string;
    threadStatusTotal: number;
};

type CountThreadsFn = (account: string, filters?: FilterType) => Promise<CountThreadsReturn[]>;

export const countThreads: DBQuery<CountThreadsFn> = (i) => async (account: string, filters?: FilterType) => {
    const queryFilters = [
        eq(threads.emailEngineAccountId, account),
        isNull(threads.deletedAt),
        isNotNull(threads.lastReplyId),
        isNotNull(threads.sequenceInfluencerId),
    ];

    if (filters && filters.funnelStatus) {
        queryFilters.push(inArray(sequenceInfluencers.funnelStatus, filters.funnelStatus));
    }

    if (filters && filters.threadStatus) {
        queryFilters.push(inArray(threads.threadStatus, filters.threadStatus));
    }

    if (filters && filters.sequences) {
        queryFilters.push(
            inArray(
                sequences.id,
                filters.sequences.map((sequence) => sequence.id),
            ),
        );
    }

    const rows = await db(i)
        .select({
            threadStatus: threads.threadStatus,
            threadStatusTotal: sql<number>`cast(count(${threads.id}) as int)`,
        })
        .from(threads)
        .leftJoin(sequenceInfluencers, eq(sequenceInfluencers.id, threads.sequenceInfluencerId))
        .leftJoin(sequences, eq(sequences.id, sequenceInfluencers.sequenceId))
        .leftJoin(
            templateVariables,
            sql`${templateVariables.sequenceId} = ${sequences.id} AND ${templateVariables.key} = 'productName'`,
        )
        .where(and(...queryFilters))
        .groupBy(threads.threadStatus);

    return rows;
};
