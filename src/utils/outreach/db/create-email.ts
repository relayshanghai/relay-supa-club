import { emails } from 'drizzle/schema';
import type { WebhookMessageNew } from 'types/email-engine/webhook-message-new';
import type { DBQuery } from '../../database';
import { db } from '../../database';
import { stringifyContacts } from '../stringify-contacts';

type CreateEmailFn = (params: { event: WebhookMessageNew }) => Promise<typeof emails.$inferSelect>;

export const createEmail: DBQuery<CreateEmailFn> = (i) => async (params) => {
    const result = await db(i)
        .insert(emails)
        .values({
            data: params.event,
            sender: stringifyContacts(params.event.data.from),
            recipients: stringifyContacts(params.event.data.to),
            threadId: params.event.data.threadId,
            emailEngineMessageId: params.event.data.messageId,
            emailEngineId: params.event.data.id,
            emailEngineAccountId: params.event.account,
        })
        .returning();

    if (result.length !== 1) throw new Error('Error in inserting row');

    return result[0];
};
