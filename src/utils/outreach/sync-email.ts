import type { DBInstance } from '../database';
import { db } from '../database';
import { createThread, createEmail } from './db';
import { parseContacts } from './parse-contacts';
import type { From } from 'types/email-engine/account-account-message-get';
import { getMessage } from '../api/email-engine';
import { stringifyContacts } from './stringify-contacts';
import { getInfluencerFromMessage } from './get-influencer-from-message';
import { getMessageType } from './get-message-type';
import { deleteEmail } from './delete-email';
import type { EMAIL_CONTACT_TYPE, MESSAGE_TYPES, THREAD_CONTACT_TYPE } from './constants';
import type { emails, profiles, threads } from 'drizzle/schema';
import { getMessageContacts } from './get-message-contacts';
import { createEmailContact } from './db/create-email-contact';
import { createThreadContact } from './db/create-thread-contact';
import type { EmailContact, ThreadContact } from './types';
import { getProfileByEmailEngineAccount } from './db/get-profile-by-email-engine-account';
import { getSequenceInfluencerByEmailAndCompanyId } from './db/get-sequence-influencer-by-email-and-company-id';

type SyncEmailParams = {
    account: string;
    emailEngineId: string;
    // for heavy account syncing
    profile?: typeof profiles.$inferSelect | null;
    // dryRun?: boolean;
    // skipMissingKol?: boolean;
};

type TransformedEmail = Omit<typeof emails.$inferSelect, 'sender' | 'recipients'> & {
    sender: From;
    recipients: From[];
};

type SyncEmailFn = (params: SyncEmailParams) => Promise<{
    influencer: Awaited<ReturnType<typeof getInfluencerFromMessage>>;
    thread: typeof threads.$inferSelect | null;
    contacts: ThreadContact[] | null;
    email: TransformedEmail | null;
    messageType: { type: MESSAGE_TYPES; weight: number };
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
        let influencer = null;
        let profile = params.profile;

        if (!profile) {
            profile = params.profile ?? (await getProfileByEmailEngineAccount(tx)(params.account));
        }

        if (!profile) {
            throw new Error(`No profile associated to account: ${params.account}`);
        }

        // get the full message data
        const emailMessage = await getMessage(params.account, params.emailEngineId);
        const messageType = await getMessageType({ message: emailMessage });

        // skip drafts
        if (messageType.type === 'Draft') {
            return { influencer: null, thread: null, contacts: null, email: null, messageType };
        }

        const messageContacts = await getMessageContacts(emailMessage);

        // @note sequence influencer holds the data of an "influencer outreach" NOT the influencer
        if (!influencer) {
            influencer = await getInfluencerFromMessage({ account: params.account, message: emailMessage, profile });
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

        const thread = await createThread(tx)({
            threadId: emailMessage.threadId,
            emailEngineAccount: params.account,
            sequenceInfluencerId: influencer?.id,
            lastReplyId: repliedMessageId,
            createdAt: String(emailMessage.date),
        });

        // @todo move to a function createThreadContact
        const createThreadContactX =
            (tx: DBInstance) =>
            async (contact: EmailContact & { type: EMAIL_CONTACT_TYPE }, profile: typeof profiles.$inferSelect) => {
                const emailContact = await createEmailContact(tx)(contact);

                let contactType: THREAD_CONTACT_TYPE = 'participant';

                if (contact.type === 'cc') {
                    contactType = 'cc';
                } else if (contact.type === 'bcc') {
                    contactType = 'bcc';
                } else if (profile?.sequence_send_email === contact.address) {
                    contactType = 'user';
                } else if (
                    profile?.company_id &&
                    (await getSequenceInfluencerByEmailAndCompanyId(tx)(contact.address, profile.company_id))
                ) {
                    contactType = 'influencer';
                }

                const threadContact = await createThreadContact(tx)(thread.thread_id, emailContact.id, contactType);

                return { ...emailContact, type: threadContact.type as THREAD_CONTACT_TYPE };
            };

        const emailContacts = [];
        for (const contact of messageContacts) {
            emailContacts.push(createThreadContactX(tx)(contact, profile));
        }

        const contacts = await Promise.all(emailContacts);

        // @note this chunk loads all the contacts not just the created ones
        // @todo move to a function getThreadContacts
        // const threadContacts = await getThreadContacts(tx)(thread.thread_id);
        // @todo create a transformer for threadContacts
        // const contacts = threadContacts
        // .filter((contact) => contact.email_contacts !== null)
        // .map((contact) => {
        // return { ...contact.email_contacts, type: contact.thread_contacts.type };
        // }) as ThreadContact[];

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
