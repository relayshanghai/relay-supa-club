import type { DBQueryReturn } from '../database';
import { db } from '../database';
import { getSequenceInfluencerByMessageId, createThread, createEmail } from './db';
import { parseContacts } from './parse-contacts';
import type { From } from 'types/email-engine/account-account-message-get';
import { getMessage } from '../api/email-engine';
import { stringifyContacts } from './stringify-contacts';
import { getProfileByEmailEngineEmail } from './db/get-profile-by-email-engine-email';

type SyncEmailParams = {
    account: string;
    emailEngineId: string;
};

type SyncEmailFn = (params: SyncEmailParams) => Promise<{
    influencer: DBQueryReturn<typeof getSequenceInfluencerByMessageId>;
    thread: any;
    email: any;
}>;

export const syncEmail: SyncEmailFn = async (params) => {
    const result = await db().transaction(async (tx) => {
        const emailMessage = await getMessage(params.account, params.emailEngineId);

        // determine the valid repliable id for this thread
        const profile = await getProfileByEmailEngineEmail(tx)(emailMessage.from.address);
        const repliedMessageId = !profile && emailMessage.inReplyTo ? emailMessage.id : null;

        const influencer = await getSequenceInfluencerByMessageId(tx)(emailMessage.messageId);

        const thread = await createThread(tx)({
            threadId: emailMessage.threadId,
            emailEngineAccount: params.account,
            sequenceInfluencerId: influencer?.id,
            lastReplyId: repliedMessageId,
            createdAt: String(emailMessage.date),
        });

        const email = await createEmail(tx)({
            data: emailMessage,
            sender: stringifyContacts(emailMessage.from),
            recipients: stringifyContacts(emailMessage.to),
            threadId: emailMessage.threadId,
            emailEngineMessageId: emailMessage.messageId,
            emailEngineId: params.emailEngineId,
            emailEngineAccountId: params.account,
            createdAt: String(emailMessage.date),
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
