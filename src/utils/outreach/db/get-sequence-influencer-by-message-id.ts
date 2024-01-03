import { eq } from 'drizzle-orm';
import { sequence_emails, sequence_influencers } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByMessageIdFn = (
    messageId: string,
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByMessageId: DBQuery<GetSequenceInfluencerByMessageIdFn> =
    (i) => async (messageId: string) => {
        // @note utilize drizzle relations
        const emails = await db(i)
            .select({ sequence_influencer_id: sequence_emails.sequence_influencer_id })
            .from(sequence_emails)
            .where(eq(sequence_emails.email_message_id, messageId))
            .limit(1);

        const email = emails.shift();

        if (email === undefined) return null;

        const result = await db(i)
            .select()
            .from(sequence_influencers)
            .where(eq(sequence_influencers.id, email.sequence_influencer_id))
            .limit(1);

        return result.shift() ?? null;
    };
