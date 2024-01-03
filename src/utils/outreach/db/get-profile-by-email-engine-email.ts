import { eq } from 'drizzle-orm';
import { profiles } from 'drizzle/schema';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';

type GetProfileByEmailEngineEmailFn = (email: string) => Promise<typeof profiles.$inferSelect | null>;

export const getProfileByEmailEngineEmail: DBQuery<GetProfileByEmailEngineEmailFn> = (i) => async (email) => {
    const rows = await db(i).select().from(profiles).where(eq(profiles.sequence_send_email, email)).limit(1);

    if (rows.length !== 1) return null;

    return rows[0];
};
