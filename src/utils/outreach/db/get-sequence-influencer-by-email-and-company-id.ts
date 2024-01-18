import { and, eq } from 'drizzle-orm';
import { sequence_influencers } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByEmailAndCompanyIdFn = (
    email: string,
    company: string,
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getSequenceInfluencerByEmailAndCompanyId: DBQuery<GetSequenceInfluencerByEmailAndCompanyIdFn> =
    (drizzlePostgresInstance) => async (email, company) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(sequence_influencers)
            .where(and(eq(sequence_influencers.email, email), eq(sequence_influencers.company_id, company)))
            .limit(1);

        if (rows.length !== 1) return null;

        return rows[0];
    };
