import { and, eq } from 'drizzle-orm';
import { sequence_influencers, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByThreadIdFn = (
    account: string,
    threadId: string,
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByThreadId: DBQuery<GetSequenceInfluencerByThreadIdFn> =
    (drizzlePostgresInstance) => async (account, threadId) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(threads)
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
            .where(and(eq(threads.email_engine_account_id, account), eq(threads.thread_id, threadId)))
            .limit(1);

        if (rows.length !== 1) return null;

        return rows[0].sequence_influencers;
    };
