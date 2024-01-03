import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import { getSequenceInfluencerByEmail, getSequenceInfluencerByMessageId, getSequenceInfluencerByThreadId } from './db';
import type { sequence_influencers } from 'drizzle/schema';
import { getSequenceInfluencerByThreadIdAndContact } from './db/get-sequence-influencer-by-thread-id-and-contact';
import type { db } from '../database';

type GetInfluencerFromMessageFn = (
    message: AccountAccountMessageGet,
    options?: { tx: ReturnType<typeof db> },
) => Promise<typeof sequence_influencers.$inferSelect | null>;

export const getInfluencerFromMessage: GetInfluencerFromMessageFn = async (message, options) => {
    const influencerByThread = await getSequenceInfluencerByThreadId(options?.tx)(message.threadId);
    if (influencerByThread) return influencerByThread;

    const influencerByMessageId = await getSequenceInfluencerByMessageId(options?.tx)(message.messageId);
    if (influencerByMessageId) return influencerByMessageId;

    const from = [message.from];
    const sender = [message.sender];
    const to = message.to;
    const cc = message.cc ?? [];
    const replyTo = message.replyTo;
    const includedContacts = [...from, ...sender, ...to, ...cc, ...replyTo];

    for (const contact of includedContacts) {
        const influencerByThreadAndEmails = await getSequenceInfluencerByThreadIdAndContact(options?.tx)(
            message.threadId,
            contact.address,
        );
        if (influencerByThreadAndEmails) return influencerByThreadAndEmails;

        const influencerByEmail = await getSequenceInfluencerByEmail(options?.tx)(contact.address);
        if (influencerByEmail) return influencerByEmail;
    }

    return null;
};
