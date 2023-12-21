import { eq } from 'drizzle-orm';
import { sequenceInfluencers } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByEmailFn = (email: string) => Promise<typeof sequenceInfluencers.$inferSelect | null>;

export const getSequenceInfluencerByEmail: DBQuery<GetSequenceInfluencerByEmailFn> = (i) => async (email: string) => {
    const rows = await db(i).select().from(sequenceInfluencers).where(eq(sequenceInfluencers.email, email)).limit(1);

    if (rows.length !== 1) return null;

    return rows[0];
};
