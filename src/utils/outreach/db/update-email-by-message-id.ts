import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { eq } from 'drizzle-orm';
import { now } from 'src/utils/datetime';

type UpdateEmailByMessageIdParams = {
    emailEngineMessageId: string;
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
            threadId: params.data.threadId,
            emailEngineId: params.data.emailEngineId,
            emailEngineAccountId: params.data.emailEngineAccountId,
            createdAt: params.data.createdAt ?? now(),
        })
        .where(eq(emails.emailEngineMessageId, params.emailEngineMessageId))
        .returning();

    if (result.length !== 1) throw new Error('Error in updating row');

    return result[0];
};
