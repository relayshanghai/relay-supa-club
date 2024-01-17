import { db } from '../database';
import { createThread, createEmail, getSequenceInfluencerByEmail } from './db';
import { parseContacts } from './parse-contacts';
import type { AccountAccountMessageGet, From } from 'types/email-engine/account-account-message-get';
import { getMessage } from '../api/email-engine';
import { stringifyContacts } from './stringify-contacts';
import { getInfluencerFromMessage } from './get-influencer-from-message';
import { getMessageType } from './get-message-type';
import { deleteEmail } from './delete-email';
import type { MESSAGE_TYPES, THREAD_CONTACT_TYPE } from './constants';
import type { emails, threads } from 'drizzle/schema';
import { getMessageContacts } from './get-message-contacts';
import { createEmailContact } from './db/create-email-contact';
import { createThreadContact } from './db/create-thread-contact';
import { getThreadContacts } from './db/get-thread-contacts';
import { getProfileByEmailEngineEmail } from './db/get-profile-by-email-engine-email';
import type { ThreadContact } from './types';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';

type SyncEmailParams = {
    account: string;
    emailEngineId: string;
    emailMessage?: MessagesGetMessage;
    dryRun?: boolean;
    skipMissingKol?: boolean;
};

type TransformedEmail = Omit<typeof emails.$inferSelect, 'sender' | 'recipients'> & {
    sender: From;
    recipients: From[];
};

type SyncEmailFn = (params: SyncEmailParams) => Promise<
    | {
          influencer: Awaited<ReturnType<typeof getInfluencerFromMessage>>;
          thread: typeof threads.$inferSelect | null;
          contacts: ThreadContact[] | null;
          email: TransformedEmail | null;
          messageType: { type: MESSAGE_TYPES; weight: number };
      }
    | false
>;

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
        let influencer = null;

        if (params.emailMessage) {
            influencer = await getInfluencerFromMessage(params.emailMessage as AccountAccountMessageGet);
            if (params.skipMissingKol && !influencer) return false;
        }

        // get the full message data
        const emailMessage = await getMessage(params.account, params.emailEngineId);
        const messageType = await getMessageType({ message: emailMessage });

        // skip drafts
        if (messageType.type === 'Draft') {
            return { influencer: null, thread: null, contacts: null, email: null, messageType };
        }

        const messageContacts = await getMessageContacts(emailMessage);

        // @note sequence influencer is holds the data of an "influencer outreach" NOT the influencer
        influencer = await getInfluencerFromMessage(emailMessage);

        if (params.skipMissingKol && !influencer) {
            return false;
        }

        // Mark emails deleted
        if (messageType.type === 'Trash') {
            const results = await deleteEmail(params.account, params.emailEngineId);
            return {
                thread: results.thread,
                email: results.email ? transformEmail(results.email) : null,
                contacts: null,
                influencer,
                messageType,
            };
        }

        // determine the valid repliable id for this thread
        const repliedMessageId = messageType.type === 'Reply' ? emailMessage.id : null;

        if (params.dryRun) {
            return {
                email: emailMessage,
                contacts: messageContacts,
                influencer,
                messageType,
            };
        }

        const thread = await createThread(tx)({
            threadId: emailMessage.threadId,
            emailEngineAccount: params.account,
            sequenceInfluencerId: influencer?.id,
            lastReplyId: repliedMessageId,
            createdAt: String(emailMessage.date),
        });

        // @todo move to a function createThreadContact
        for (const contact of messageContacts) {
            const emailContact = await createEmailContact(tx)(contact);

            let contactType: THREAD_CONTACT_TYPE = 'participant';

            if (await getSequenceInfluencerByEmail(tx)(contact.address)) {
                contactType = 'influencer';
            } else if (await getProfileByEmailEngineEmail(tx)(contact.address)) {
                contactType = 'user';
            } else if (contact.type === 'cc') {
                contactType = 'cc';
            } else if (contact.type === 'bcc') {
                contactType = 'bcc';
            }

            await createThreadContact(tx)(thread.thread_id, emailContact.id, contactType);
        }

        // @todo move to a function getThreadContacts
        const threadContacts = await getThreadContacts(tx)(thread.thread_id);
        // @todo create a transformer for threadContacts
        const contacts = threadContacts
            .filter((contact) => contact.email_contacts !== null)
            .map((contact) => {
                return { ...contact.email_contacts, type: contact.thread_contacts.type };
            }) as ThreadContact[];

        // @todo move to a function createThreadContact

        const email = await createEmail(tx)({
            data: emailMessage,
            sender: stringifyContacts(emailMessage.from),
            recipients: stringifyContacts(emailMessage.to),
            thread_id: emailMessage.threadId,
            email_engine_message_id: emailMessage.messageId,
            email_engine_id: params.emailEngineId,
            email_engine_account_id: params.account,
            created_at: String(emailMessage.date),
        });

        if (!email) {
            return tx.rollback();
        }

        return { influencer, thread, contacts, email: transformEmail(email), messageType };
    });

    return result;
};
