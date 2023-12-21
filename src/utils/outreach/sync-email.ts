import { db } from '../database';
import { createThread, createEmail } from './db';
import { parseContacts } from './parse-contacts';
import type { From } from 'types/email-engine/account-account-message-get';
import { getMessage } from '../api/email-engine';
import { stringifyContacts } from './stringify-contacts';
import { getProfileByEmailEngineEmail } from './db/get-profile-by-email-engine-email';
import { getInfluencerFromMessage } from './get-influencer-from-message';

type SyncEmailParams = {
    account: string;
    emailEngineId: string;
};

type SyncEmailFn = (params: SyncEmailParams) => Promise<{
    influencer: Awaited<ReturnType<typeof getInfluencerFromMessage>>;
    thread: any;
    email: any;
}>;

/**
 * Upserts a thread and email based on the message received from Email Engine
 */
export const syncEmail: SyncEmailFn = async (params) => {
    const result = await db().transaction(async (tx) => {
        // get the full message data
        const emailMessage = await getMessage(params.account, params.emailEngineId);

        // determine the valid repliable id for this thread
        const profile = await getProfileByEmailEngineEmail(tx)(emailMessage.from.address);
        const repliedMessageId = !profile && emailMessage.inReplyTo ? emailMessage.id : null;

        // @note sequence influencer is holds the data of an "influencer outreach" NOT the influencer
        const influencer = await getInfluencerFromMessage(emailMessage);

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
