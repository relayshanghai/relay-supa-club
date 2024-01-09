import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm';
import { threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import type { ThreadsFilter } from 'src/utils/endpoints/get-threads';

export type CountThreadsReturn = {
    thread_status: string;
    thread_status_total: number;
};

type CountThreadsFn = (account: string, filters?: ThreadsFilter) => Promise<CountThreadsReturn[]>;

export const countThreads: DBQuery<CountThreadsFn> = (drizzlePostgresInstance) => async (account: string) => {
    const queryFilters = [
        eq(threads.email_engine_account_id, account),
        isNull(threads.deleted_at),
        isNotNull(threads.last_reply_id),
        isNotNull(threads.sequence_influencer_id),
    ];

    const rows = await db(drizzlePostgresInstance)
        .select({
            thread_status: threads.thread_status,
            thread_status_total: sql<number>`cast(count(${threads.id}) as int)`,
        })
        .from(threads)

        .where(and(...queryFilters))
        .groupBy(threads.thread_status);

    return rows;
};
