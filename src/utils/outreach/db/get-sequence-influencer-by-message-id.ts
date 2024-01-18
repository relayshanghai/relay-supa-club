import { eq } from 'drizzle-orm';
import { sequence_emails, sequence_influencers } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByMessageIdFn = (
    messageId: string,
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByMessageId: DBQuery<GetSequenceInfluencerByMessageIdFn> =
    (drizzlePostgresInstance) => async (messageId: string) => {
        // @note utilize drizzle relations
        const emails = await db(drizzlePostgresInstance)
            .select()
            .from(sequence_emails)
            .leftJoin(sequence_influencers, eq(sequence_influencers.id, sequence_emails.sequence_influencer_id))
            .where(eq(sequence_emails.email_message_id, messageId))
            .limit(1);

        if (emails.length !== 1) return null;

        return emails[0].sequence_influencers;

        // const email = emails.shift();

        // if (email === undefined) return null;

        // const result = await db(drizzlePostgresInstance)
        //     .select()
        //     .from(sequence_influencers)
        //     .where(eq(sequence_influencers.id, email.sequence_influencer_id))
        //     .limit(1);

        // return result.shift() ?? null;
    };
