import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, desc, eq, isNull } from 'drizzle-orm';

type GetEmailsFn = (threadId: string) => Promise<(typeof emails.$inferSelect)[]>;

export const getEmails: DBQuery<GetEmailsFn> = (i) => async (threadId: string) => {
    const rows = await db(i)
        .select()
        .from(emails)
        .where(and(eq(emails.threadId, threadId), isNull(emails.deletedAt)))
        .orderBy(desc(emails.createdAt));

    return rows;
};
