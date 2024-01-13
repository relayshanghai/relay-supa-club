import { eq } from 'drizzle-orm';
import { sequence_influencers } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByEmailFn = (email: string) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByEmail: DBQuery<GetSequenceInfluencerByEmailFn> =
    (drizzlePostgresInstance) => async (email: string) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(sequence_influencers)
            .where(eq(sequence_influencers.email, email))
            .limit(1);

        if (rows.length !== 1) return null;

        return rows[0];
    };
