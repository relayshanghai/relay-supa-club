import { and, eq, ilike, or } from 'drizzle-orm';
import { emails, sequence_influencers, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByThreadIdAndContactFn = (
    threadId: string,
    contact: string,
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByThreadIdAndContact: DBQuery<GetSequenceInfluencerByThreadIdAndContactFn> =
    (drizzlePostgresInstance) => async (threadId: string, contact: string) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(emails)
            .where(
                and(
                    eq(emails.thread_id, threadId),
                    or(ilike(emails.sender, `%${contact}%`), ilike(emails.recipients, `%${contact}%`)),
                ),
            )
            .limit(1);

        if (rows.length !== 1) return null;

        const threadrows = await db(drizzlePostgresInstance)
            .select()
            .from(threads)
            .where(eq(threads.thread_id, threadId))
            .limit(1);

        if (threadrows.length !== 1) return null;

        if (!threadrows[0].sequence_influencer_id) return null;

        const results = await db(drizzlePostgresInstance)
            .select()
            .from(sequence_influencers)
            .where(eq(sequence_influencers.id, threadrows[0].sequence_influencer_id))
            .limit(1);

        if (results.length !== 1) return null;

        return results[0];
    };
