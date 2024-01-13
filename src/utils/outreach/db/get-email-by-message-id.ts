import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { and, desc, eq, isNull } from 'drizzle-orm';

type GetEmailByMessageIdFn = (messageId: string) => Promise<typeof emails.$inferSelect | null>;

export const getEmailByMessageId: DBQuery<GetEmailByMessageIdFn> =
    (drizzlePostgresInstance) => async (messageId: string) => {
        const rows = await db(drizzlePostgresInstance)
            .select()
            .from(emails)
            .where(and(eq(emails.email_engine_message_id, messageId), isNull(emails.deleted_at)))
            .orderBy(desc(emails.created_at));

        if (rows.length !== 1) return null;

        return rows[0];
    };
