import { eq } from 'drizzle-orm';
import { sequenceInfluencers, threads } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type GetSequenceInfluencerByThreadIdFn = (threadId: string) => Promise<typeof sequenceInfluencers.$inferSelect | null>;

export const getSequenceInfluencerByThreadId: DBQuery<GetSequenceInfluencerByThreadIdFn> =
    (i) => async (threadId: string) => {
        const rows = await db(i).select().from(threads).where(eq(threads.threadId, threadId)).limit(1);

        if (rows.length !== 1) return null;

        if (!rows[0].sequenceInfluencerId) return null;

        const results = await db(i)
            .select()
            .from(sequenceInfluencers)
            .where(eq(sequenceInfluencers.id, rows[0].sequenceInfluencerId))
            .limit(1);

        if (results.length !== 1) return null;

        return results[0];
    };
