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
    const to = message.to ?? [];
    const cc = message.cc ?? [];
    const replyTo = message.replyTo ?? [];
    const includedContacts = Array.from(new Set([...from, ...sender, ...to, ...cc, ...replyTo].map((e) => e.address)));
    const queries = [];

    for (const contact of includedContacts) {
        const influencerByThreadAndEmails = getSequenceInfluencerByThreadIdAndContact(options?.tx)(
            message.threadId,
            contact,
        );

        queries.push(influencerByThreadAndEmails);

        if (profile?.company_id) {
            const influencerByEmail = getSequenceInfluencerByEmailAndCompanyId(options?.tx)(
                contact,
                profile.company_id,
            );
            queries.push(influencerByEmail);
        }
    }

    const results = await Promise.allSettled(queries);

    for (const result of results) {
        if (result.status === 'fulfilled' && result.value) return influencerOutreachDataTransformer(result.value);
    }

    return null;
};
