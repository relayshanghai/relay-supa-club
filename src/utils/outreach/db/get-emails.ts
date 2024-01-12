import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, desc, eq, isNull } from 'drizzle-orm';

type GetEmailsFn = (threadId: string) => Promise<(typeof emails.$inferSelect)[]>;

export const getEmails: DBQuery<GetEmailsFn> = (drizzlePostgresInstance) => async (threadId: string) => {
    const rows = await db(drizzlePostgresInstance)
        .select()
        .from(emails)
        .where(and(eq(emails.thread_id, threadId), isNull(emails.deleted_at)))
        .orderBy(desc(emails.created_at));

    return rows;
};
