import type { WebhookMessageNew } from 'types/email-engine/webhook-message-new';
import type { DBQueryReturn } from '../database';
import { db } from '../database';
import { getSequenceInfluencerByMessageId, createThread, createEmail } from './db';
import { parseContacts } from './parse-contacts';
import type { From } from 'types/email-engine/account-account-message-get';

type SyncEmailFn = (event: WebhookMessageNew) => Promise<{
    influencer: DBQueryReturn<typeof getSequenceInfluencerByMessageId>;
    thread: any;
    email: any;
}>;

export const syncEmail: SyncEmailFn = async (event) => {
    const result = await db().transaction(async (tx) => {
        const influencer = await getSequenceInfluencerByMessageId(tx)(event.data.messageId);

        const thread = await createThread(tx)({
            sequenceInfluencerId: influencer?.id ?? null,
            threadId: event.data.threadId,
            emailEngineAccount: event.account,
            emailEngineId: event.data.id,
        });

        const email = await createEmail(tx)({
            event: event,
        });

        if (!email) {
            return tx.rollback();
        }

        // @todo use mapWith?
        const transformedEmail: Omit<typeof email, 'sender' | 'recipients'> & { sender: From; recipients: From[] } = {
            ...email,
            sender: parseContacts(email.sender)[0],
            recipients: parseContacts(email.recipients),
        };

        return { influencer, thread, email: transformedEmail };
    });

    return result;
};
