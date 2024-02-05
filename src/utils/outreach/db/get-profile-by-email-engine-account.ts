import { eq } from 'drizzle-orm';
import { profiles } from 'drizzle/schema';
import type { DBQuery } from 'src/utils/database';
import { db } from 'src/utils/database';

type GetProfileByEmailEngineAccountFn = (account: string) => Promise<typeof profiles.$inferSelect | null>;

export const getProfileByEmailEngineAccount: DBQuery<GetProfileByEmailEngineAccountFn> =
    (drizzlePostgresInstance) => async (account) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(profiles)
            .where(eq(profiles.email_engine_account_id, account))
            .limit(1);

        if (rows.length !== 1) return null;

        return rows[0];
    };
