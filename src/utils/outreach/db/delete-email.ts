import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';
import { now } from 'src/utils/datetime';

type DeleteEmailFn = (emailid: string) => Promise<typeof emails.$inferSelect | null>;

export const deleteEmail: DBQuery<DeleteEmailFn> = (i) => async (emailId: string) => {
    const rows = await db(i)
        .update(emails)
        .set({ deletedAt: now() })
        .where(eq(emails.emailEngineId, emailId))
        .returning();

    if (rows.length !== 1) return null;

    return rows[0];
};
