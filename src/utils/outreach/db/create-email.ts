import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';
import { now } from 'src/utils/datetime';

type CreateEmailFn = (params: typeof emails.$inferInsert) => Promise<typeof emails.$inferSelect>;

export const createEmail: DBQuery<CreateEmailFn> = (drizzlePostgresInstance) => async (params) => {
    let result = await db(drizzlePostgresInstance)
        .insert(emails)
        .values({
            data: params.data,
            sender: params.sender,
            recipients: params.recipients,
            thread_id: params.thread_id,
            email_engine_message_id: params.email_engine_message_id,
            email_engine_id: `${params.email_engine_account_id}:${params.email_engine_id}`,
            email_engine_account_id: params.email_engine_account_id,
            created_at: params.created_at ?? now(),
        })
        .onConflictDoNothing({ target: emails.email_engine_id })
        .returning();

    if (result.length <= 0) {
        result = await db(drizzlePostgresInstance)
            .select()
            .from(emails)
            .where(eq(emails.email_engine_id, `${params.email_engine_account_id}:${params.email_engine_id}`))
            .limit(1);
    }

    if (result.length !== 1) throw new Error('Error in inserting row');

    return result[0];
};
