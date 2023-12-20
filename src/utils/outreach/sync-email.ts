import type { DBQueryReturn } from '../database';
import { db } from '../database';
import { getSequenceInfluencerByMessageId, createThread, createEmail } from './db';
import { parseContacts } from './parse-contacts';
import type { From } from 'types/email-engine/account-account-message-get';
import { getMessage } from '../api/email-engine';
import { stringifyContacts } from './stringify-contacts';

type SyncEmailParams = {
    account: string;
    emailEngineId: string;
};

type SyncEmailFn = (event: SyncEmailParams) => Promise<{
    influencer: DBQueryReturn<typeof getSequenceInfluencerByMessageId>;
    thread: any;
    email: any;
}>;

export const syncEmail: SyncEmailFn = async (event) => {
    const result = await db().transaction(async (tx) => {
        const emailMessage = await getMessage(event.account, event.emailEngineId);

        const influencer = await getSequenceInfluencerByMessageId(tx)(emailMessage.messageId);

        const thread = await createThread(tx)({
            sequenceInfluencerId: influencer?.id ?? null,
            threadId: emailMessage.threadId,
            emailEngineAccount: event.account,
            emailEngineId: event.emailEngineId,
        });

        const email = await createEmail(tx)({
            data: emailMessage,
            sender: stringifyContacts(emailMessage.from),
            recipients: stringifyContacts(emailMessage.to),
            threadId: emailMessage.threadId,
            emailEngineMessageId: emailMessage.messageId,
            emailEngineId: event.emailEngineId,
            emailEngineAccountId: event.account,
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
