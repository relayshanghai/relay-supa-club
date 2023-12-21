import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, desc, eq, isNull } from 'drizzle-orm';

type GetEmailByMessageIdFn = (messageId: string) => Promise<typeof emails.$inferSelect | null>;

export const getEmailByMessageId: DBQuery<GetEmailByMessageIdFn> = (i) => async (messageId: string) => {
    const rows = await db(i)
        .select()
        .from(emails)
        .where(and(eq(emails.emailEngineMessageId, messageId), isNull(emails.deletedAt)))
        .orderBy(desc(emails.createdAt));

    if (rows.length !== 1) return null;

    return rows[0];
};
