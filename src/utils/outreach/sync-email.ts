import { db } from '../database';
import { createThread, createEmail } from './db';
import { parseContacts } from './parse-contacts';
import type { From } from 'types/email-engine/account-account-message-get';
import { getMessage } from '../api/email-engine';
import { stringifyContacts } from './stringify-contacts';
import { getProfileByEmailEngineEmail } from './db/get-profile-by-email-engine-email';
import { getInfluencerFromMessage } from './get-influencer-from-message';
import { getMessageType } from './get-message-type';
import { deleteEmail } from './delete-email';
import type { MESSAGE_TYPES } from './constants';
import type { emails, threads } from 'drizzle/schema';

type SyncEmailParams = {
    account: string;
    emailEngineId: string;
};

type TransformedEmail = Omit<typeof emails.$inferSelect, 'sender' | 'recipients'> & {
    sender: From;
    recipients: From[];
};

type SyncEmailFn = (params: SyncEmailParams) => Promise<{
    influencer: Awaited<ReturnType<typeof getInfluencerFromMessage>>;
    thread: typeof threads.$inferSelect | null;
    email: TransformedEmail | null;
    messageType: MESSAGE_TYPES;
}>;

// @todo use drizzle mapWith?
const transformEmail = (email: typeof emails.$inferSelect): TransformedEmail => {
    return {
        ...email,
        sender: parseContacts(email.sender)[0],
        recipients: parseContacts(email.recipients),
    };
};

/**
 * Upserts a thread and email based on the message received from Email Engine
 */
export const syncEmail: SyncEmailFn = async (params) => {
    const result = await db().transaction(async (tx) => {
        // get the full message data
        const emailMessage = await getMessage(params.account, params.emailEngineId);
        const messageType = await getMessageType({ message: emailMessage });

        // skip drafts
        if (messageType === 'Draft') {
            return { influencer: null, thread: null, email: null, messageType };
        }

        // @note sequence influencer is holds the data of an "influencer outreach" NOT the influencer
        const influencer = await getInfluencerFromMessage(emailMessage);

        // Mark emails deleted
        if (messageType === 'Trash') {
            const results = await deleteEmail(params.emailEngineId);
            return {
                thread: results.thread,
                email: results.email ? transformEmail(results.email) : null,
                influencer,
                messageType,
            };
        }

        // determine the valid repliable id for this thread
        const profile = await getProfileByEmailEngineEmail(tx)(emailMessage.from.address);
        const repliedMessageId = !profile && emailMessage.inReplyTo ? emailMessage.id : null;

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

        return { influencer, thread, email: transformEmail(email), messageType };
    });

    return result;
};
