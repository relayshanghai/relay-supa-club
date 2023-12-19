import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';

type GetEmailsFn = (threadId: string) => Promise<(typeof emails.$inferSelect)[]>;

export const getEmails: DBQuery<GetEmailsFn> = (i) => async (threadId: string) => {
    const rows = await db(i).select().from(emails).where(eq(emails.threadId, threadId));

    return rows;
};
