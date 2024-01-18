import { eq } from 'drizzle-orm';
import { sequence_emails, sequence_influencers } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByMessageIdFn = (
    messageId: string,
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByMessageId: DBQuery<GetSequenceInfluencerByMessageIdFn> =
    (drizzlePostgresInstance) => async (messageId: string) => {
        const emails = await db(drizzlePostgresInstance)
            .select()
            .from(sequence_emails)
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, sequence_emails.sequence_influencer_id))
            .where(eq(sequence_emails.email_message_id, messageId))
            .limit(1);

        if (emails.length !== 1) return null;

        return emails[0].sequence_influencers;
    };
