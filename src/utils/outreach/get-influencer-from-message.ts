import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import { getSequenceInfluencerByEmail, getSequenceInfluencerByMessageId, getSequenceInfluencerByThreadId } from './db';
import { getSequenceInfluencerByThreadIdAndContact } from './db/get-sequence-influencer-by-thread-id-and-contact';
import type { db } from '../database';
import type { InfluencerOutreachData } from './types';
import { influencerOutreachDataTransformer } from './transformers/influencer-outreach-data-transformer';

type GetInfluencerFromMessageFn = (
    message: AccountAccountMessageGet,
    options?: { tx: ReturnType<typeof db> },
) => Promise<InfluencerOutreachData | null>;

export const getInfluencerFromMessage: GetInfluencerFromMessageFn = async (message, options) => {
    const influencerByThread = await getSequenceInfluencerByThreadId(options?.tx)(message.threadId);
    if (influencerByThread) {
        return influencerOutreachDataTransformer(influencerByThread);
    }

    const influencerByMessageId = await getSequenceInfluencerByMessageId(options?.tx)(message.messageId);
    if (influencerByMessageId) {
        return influencerOutreachDataTransformer(influencerByMessageId);
    }

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
        if (influencerByThreadAndEmails) {
            return influencerOutreachDataTransformer(influencerByThreadAndEmails);
        }

        const influencerByEmail = await getSequenceInfluencerByEmail(options?.tx)(contact.address);
        if (influencerByEmail) {
            return influencerOutreachDataTransformer(influencerByEmail);
        }
    }

    return null;
};
