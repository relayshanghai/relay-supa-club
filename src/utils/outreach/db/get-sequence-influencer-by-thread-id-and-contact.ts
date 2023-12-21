import { and, eq, ilike, or } from 'drizzle-orm';
import { emails, sequenceInfluencers, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByThreadIdAndContactFn = (
    threadId: string,
    contact: string,
) => Promise<typeof sequenceInfluencers.$inferSelect | null>;

export const getSequenceInfluencerByThreadIdAndContact: DBQuery<GetSequenceInfluencerByThreadIdAndContactFn> =
    (i) => async (threadId: string, contact: string) => {
        const rows = await db(i)
            .select()
            .from(emails)
            .where(
                and(
                    eq(emails.threadId, threadId),
                    or(ilike(emails.sender, `%${contact}%`), ilike(emails.recipients, `%${contact}%`)),
                ),
            )
            .limit(1);

        if (rows.length !== 1) return null;

        const threadrows = await db(i).select().from(threads).where(eq(threads.threadId, threadId)).limit(1);

        if (threadrows.length !== 1) return null;

        if (!threadrows[0].sequenceInfluencerId) return null;

        const results = await db(i)
            .select()
            .from(sequenceInfluencers)
            .where(eq(sequenceInfluencers.id, threadrows[0].sequenceInfluencerId))
            .limit(1);

        if (results.length !== 1) return null;

        return results[0];
    };
