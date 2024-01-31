import {
    influencer_social_profiles,
    sequence_influencers,
    sequences,
    template_variables,
    threads,
} from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, eq, isNull, sql, desc, isNotNull, inArray, ne } from 'drizzle-orm';
import type { ThreadsFilter } from 'src/utils/endpoints/get-threads';

const THREADS_PER_PAGE = 10;

export type GetThreadsReturn = {
    threads: typeof threads.$inferSelect;
    sequence_influencers: typeof sequence_influencers.$inferSelect | null;
    sequences: typeof sequences.$inferSelect | null;
    template_variables: typeof template_variables.$inferSelect | null;
    influencer_social_profiles: typeof influencer_social_profiles.$inferSelect | null;
};

type GetThreadsFn = (account: string, filters?: ThreadsFilter) => Promise<GetThreadsReturn[]>;
type GetThreadCountFn = (account: string, filters?: ThreadsFilter) => Promise<number>;

export const getThreads: DBQuery<GetThreadsFn> =
    (drizzlePostgresInstance) => async (account: string, filters?: ThreadsFilter) => {
        const queryFilters = [
            eq(threads.email_engine_account_id, account),
            isNull(threads.deleted_at),
            isNotNull(threads.last_reply_id),
            isNotNull(threads.sequence_influencer_id),
            ne(sequence_influencers.funnel_status, 'In Sequence'),
        ];

        const page = filters?.page || 0;

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

        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(threads)
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
            .leftJoin(
                influencer_social_profiles,
                eq(influencer_social_profiles.id, sequence_influencers.influencer_social_profile_id),
            )
            .leftJoin(sequences, eq(sequences.id, sequence_influencers.sequence_id))
            .leftJoin(
                template_variables,
                sql`${template_variables.sequence_id} = ${sequences.id} AND ${template_variables.key} = 'productName'`,
            )
            .where(and(...queryFilters))
            .orderBy(desc(threads.last_reply_date))
            .limit(THREADS_PER_PAGE)
            .offset(page * THREADS_PER_PAGE);

        return rows;
    };

export const getFilteredThreadCount: DBQuery<GetThreadCountFn> =
    (drizzlePostgresInstance) => async (account: string, filters?: ThreadsFilter) => {
        const queryFilters = [
            eq(threads.email_engine_account_id, account),
            isNull(threads.deleted_at),
            isNotNull(threads.last_reply_id),
            isNotNull(threads.sequence_influencer_id),
            ne(sequence_influencers.funnel_status, 'In Sequence'),
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

        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(threads)
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
            .leftJoin(
                influencer_social_profiles,
                eq(influencer_social_profiles.id, sequence_influencers.influencer_social_profile_id),
            )
            .leftJoin(sequences, eq(sequences.id, sequence_influencers.sequence_id))
            .leftJoin(
                template_variables,
                sql`${template_variables.sequence_id} = ${sequences.id} AND ${template_variables.key} = 'productName'`,
            )
            .where(and(...queryFilters));

        return rows.length;
    };
