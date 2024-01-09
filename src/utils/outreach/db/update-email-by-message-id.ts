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

export const updateEmailByMessageId: DBQuery<UpdateEmailByMessageIdFn> = (i) => async (params) => {
    const result = await db(i)
        .update(emails)
        .set({
            data: params.data.data,
            sender: params.data.sender,
            recipients: params.data.recipients,
            thread_id: params.data.thread_id,
            email_engine_id: params.data.email_engine_id,
            email_engine_account_id: params.data.email_engine_account_id,
            created_at: params.data.created_at ?? now(),
        })
        .where(eq(emails.email_engine_message_id, params.email_engine_message_id))
        .returning();

    if (result.length !== 1) throw new Error('Error in updating row');

    return result[0];
};