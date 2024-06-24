import { sequence_emails, sequence_influencers, sequence_steps, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, desc, eq, isNull } from 'drizzle-orm';

type GetThreadReturn = {
    thread: typeof threads.$inferSelect;
    sequence_influencer: typeof sequence_influencers.$inferSelect | null;
    sequence_emails: typeof sequence_emails.$inferSelect | null;
    sequence_steps: typeof sequence_steps.$inferSelect | null;
};

type GetThreadFn = (account: string, sequenceInfluencerId: string) => Promise<GetThreadReturn | null>;

export const getThreadByInfluencerId: DBQuery<GetThreadFn> =
    (drizzlePostgresInstance) => async (account, sequenceInfluencerId) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(threads)
            .where(
                and(
                    eq(threads.email_engine_account_id, account),
                    eq(threads.sequence_influencer_id, sequenceInfluencerId),
                    isNull(threads.deleted_at),
                ),
            )
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
            .leftJoin(sequence_emails, eq(sequence_emails.sequence_influencer_id, threads.sequence_influencer_id))
            .leftJoin(sequence_steps, eq(sequence_steps.id, sequence_emails.sequence_step_id))
            .orderBy(desc(sequence_steps.step_number));

        if (!rows.length) return null;

        return {
            thread: rows[0].threads,
            sequence_influencer: rows[0].sequence_influencers,
            sequence_emails: rows[0].sequence_emails,
            sequence_steps: rows[0].sequence_steps,
        };
    };
