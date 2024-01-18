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
        // const emailContactsRows = await db().select().from(email_contacts).where(eq(email_contacts.address, contact)).limit(1)

        // if (emailContactsRows.length !== 1) return null;

        const threadContactRows = await db(drizzlePostgresInstance)
            .select()
            .from(thread_contacts)
            .leftJoin(email_contacts, eq(email_contacts.id, thread_contacts.email_contact_id))
            .leftJoin(threads, eq(threads.thread_id, thread_contacts.thread_id))
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, threads.sequence_influencer_id))
            .where(and(eq(thread_contacts.thread_id, threadId), eq(email_contacts.address, contact)))
            .limit(1);

        // const rows = await db(drizzlePostgresInstance)
        //     .select()
        //     .from(emails)
        //     .where(
        //         and(
        //             eq(emails.thread_id, threadId),
        //             or(ilike(emails.sender, `%${contact}%`), ilike(emails.recipients, `%${contact}%`)),
        //         ),
        //     )
        //     .limit(1);

        if (threadContactRows.length === 0) return null;

        return threadContactRows[0].sequence_influencers;

        // const threadrows = await db(drizzlePostgresInstance)
        //     .select()
        //     .from(threads)
        //     .where(eq(threads.thread_id, threadId))
        //     .limit(1);

        // if (threadrows.length !== 1) return null;

        // if (!threadrows[0].sequence_influencer_id) return null;

        // const results = await db(drizzlePostgresInstance)
        //     .select()
        //     .from(sequence_influencers)
        //     .where(eq(sequence_influencers.id, threadrows[0].sequence_influencer_id))
        //     .limit(1);

        // if (results.length !== 1) return null;

        // return results[0];
    };
