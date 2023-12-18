import { eq } from 'drizzle-orm';
import { sequenceEmails, sequenceInfluencers } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByMessageIdFn = (
    messageId: string,
) => Promise<typeof sequenceInfluencers.$inferSelect | null>;

export const getSequenceInfluencerByMessageId: DBQuery<GetSequenceInfluencerByMessageIdFn> =
    (i) => async (messageId: string) => {
        // @note utilize drizzle relations
        const emails = await db(i)
            .select({ sequenceInfluencerId: sequenceEmails.sequenceInfluencerId })
            .from(sequenceEmails)
            .where(eq(sequenceEmails.emailMessageId, messageId))
            .limit(1);

        const email = emails.shift();

        if (email === undefined) return null;

        const result = await db(i)
            .select()
            .from(sequenceInfluencers)
            .where(eq(sequenceInfluencers.id, email.sequenceInfluencerId))
            .limit(1);

        return result.shift() ?? null;
    };
