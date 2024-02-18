import type { AccountAccountMessageGet } from 'types/email-engine/account-account-message-get';
import { getSequenceInfluencerByMessageId, getSequenceInfluencerByThreadId } from './db';
import { getSequenceInfluencerByThreadIdAndContact } from './db/get-sequence-influencer-by-thread-id-and-contact';
import type { DBInstance } from '../database';
import type { InfluencerOutreachData } from './types';
import { influencerOutreachDataTransformer } from './transformers/influencer-outreach-data-transformer';
import { getSequenceInfluencerByEmailAndCompanyId } from './db/get-sequence-influencer-by-email-and-company-id';
import type { profiles } from 'drizzle/schema';

type GetInfluencerFromMessageFn = (params: {
    message: AccountAccountMessageGet;
    account: string; // EE account id
    profile: typeof profiles.$inferSelect;
    tx?: DBInstance;
}) => Promise<InfluencerOutreachData | null>;

export const getInfluencerFromMessage: GetInfluencerFromMessageFn = async (params) => {
    const influencerByThread = await getSequenceInfluencerByThreadId(params.tx)(
        params.account,
        params.message.threadId,
    );
    if (influencerByThread) {
        return influencerOutreachDataTransformer(influencerByThread);
    }

    const influencerByMessageId = await getSequenceInfluencerByMessageId(params.tx)(params.message.messageId);
    if (influencerByMessageId) {
        return influencerOutreachDataTransformer(influencerByMessageId);
    }

    const from = [params.message.from];
    const sender = [params.message.sender];
    const to = params.message.to ?? [];
    const cc = params.message.cc ?? [];
    const replyTo = params.message.replyTo ?? [];
    const includedContacts = Array.from(new Set([...from, ...sender, ...to, ...cc, ...replyTo].map((e) => e.address)));
    const queries = [];

    for (const contact of includedContacts) {
        const influencerByThreadAndEmails = getSequenceInfluencerByThreadIdAndContact(params.tx)(
            params.message.threadId,
            contact,
        );

        queries.push(influencerByThreadAndEmails);

        if (params.profile?.company_id) {
            const influencerByEmail = getSequenceInfluencerByEmailAndCompanyId(params.tx)(
                contact,
                params.profile.company_id,
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
