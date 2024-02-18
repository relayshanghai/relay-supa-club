import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';
import { now } from 'src/utils/datetime';

type UpdateEmailByMessageIdParams = {
    email_engine_message_id: string;
    data: Omit<typeof emails.$inferInsert, 'emailEngineMessageId'>;
};

type UpdateEmailByMessageIdFn = (params: UpdateEmailByMessageIdParams) => Promise<typeof emails.$inferSelect>;

export const updateEmailByMessageId: DBQuery<UpdateEmailByMessageIdFn> =
    (drizzlePostgresInstance) =>
    async ({ email_engine_message_id, data }) => {
        const result = await db(drizzlePostgresInstance)
            .update(emails)
            .set({
                data: data.data,
                sender: data.sender,
                recipients: data.recipients,
                thread_id: data.thread_id,
                email_engine_id: `${data.email_engine_account_id}:${data.email_engine_id}`,
                email_engine_account_id: data.email_engine_account_id,
                created_at: data.created_at ?? now(),
            })
            .where(eq(emails.email_engine_message_id, email_engine_message_id))
            .returning();

        if (result.length !== 1) throw new Error('Error in updating row');

        return result[0];
    };
