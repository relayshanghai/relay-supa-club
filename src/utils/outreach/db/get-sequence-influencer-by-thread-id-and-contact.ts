import { and, eq } from 'drizzle-orm';
import { email_contacts, sequence_influencers, thread_contacts, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByThreadIdAndContactFn = (
    threadId: string,
    contact: string,
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByThreadIdAndContact: DBQuery<GetSequenceInfluencerByThreadIdAndContactFn> =
    (drizzlePostgresInstance) => async (threadId: string, contact: string) => {
        const threadContactRows = await db(drizzlePostgresInstance)
            .select()
            .from(thread_contacts)
            .leftJoin(email_contacts, eq(email_contacts.id, thread_contacts.email_contact_id))
            .leftJoin(threads, eq(threads.thread_id, thread_contacts.thread_id))
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
            .where(and(eq(thread_contacts.thread_id, threadId), eq(email_contacts.address, contact)))
            .limit(1);

        if (threadContactRows.length === 0) return null;

        return threadContactRows[0].sequence_influencers;
    };
