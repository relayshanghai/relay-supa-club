import { emails } from 'drizzle/schema';
import type { DBQuery } from '../../database';
import { db } from '../../database';

type CreateEmailFn = (params: typeof emails.$inferInsert) => Promise<typeof emails.$inferSelect>;

export const createEmail: DBQuery<CreateEmailFn> = (i) => async (params) => {
    const result = await db(i)
        .insert(emails)
        .values({
            data: params.data,
            sender: params.sender,
            recipients: params.recipients,
            threadId: params.threadId,
            emailEngineMessageId: params.emailEngineMessageId,
            emailEngineId: params.emailEngineId,
            emailEngineAccountId: params.emailEngineAccountId,
        })
        .returning();

    if (result.length !== 1) throw new Error('Error in inserting row');

    return result[0];
};
