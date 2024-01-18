import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import { getSequenceInfluencerByMessageId, getSequenceInfluencerByThreadId } from './db';
import { getSequenceInfluencerByThreadIdAndContact } from './db/get-sequence-influencer-by-thread-id-and-contact';
import type { db } from '../database';
import type { InfluencerOutreachData } from './types';
import { influencerOutreachDataTransformer } from './transformers/influencer-outreach-data-transformer';
import { getSequenceInfluencerByEmailAndCompanyId } from './db/get-sequence-influencer-by-email-and-company-id';
import type { profiles } from 'drizzle/schema';

type GetInfluencerFromMessageFn = (
    message: AccountAccountMessageGet,
    profile: typeof profiles.$inferSelect,
    options?: { tx: ReturnType<typeof db> },
) => Promise<InfluencerOutreachData | null>;

export const getInfluencerFromMessage: GetInfluencerFromMessageFn = async (message, profile, options) => {
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

        if (profile.company_id) {
            const influencerByEmail = await getSequenceInfluencerByEmailAndCompanyId(options?.tx)(
                contact.address,
                profile.company_id,
            );

            if (influencerByEmail) {
                return influencerOutreachDataTransformer(influencerByEmail);
            }
        }
    }

    return null;
};
