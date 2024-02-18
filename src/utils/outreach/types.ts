import type { addresses, email_contacts, sequence_influencers, sequences, threads } from 'drizzle/schema';
import type { FUNNEL_STATUS, THREAD_CONTACT_TYPE } from './constants';
import type { CreatorPlatform, SearchTableInfluencer } from 'types';

export type EmailContact = { address: string; name?: string | null };

export type AttachmentFile = { id?: string; filename: string; content: string | File };

// Holds the outreach data of the current influencer in that outreach
export type InfluencerOutreachData = typeof sequence_influencers.$inferSelect & {
    funnel_status: FUNNEL_STATUS;
    platform: CreatorPlatform;
    recent_post_title: string;
    recent_post_url: string;
    manager_first_name?: string;
    address?: typeof addresses.$inferSelect;
};

export type Outreach = typeof sequences.$inferSelect & {
    productName?: string | null;
};

export type ThreadContact = typeof email_contacts.$inferSelect & {
    type: THREAD_CONTACT_TYPE;
};

/**
 * Contains Thread data
 */
export type Thread = {
    threadInfo: typeof threads.$inferSelect;
    sequenceInfluencer: InfluencerOutreachData | null;
    contacts: ThreadContact[];
    sequenceInfo: Outreach | null;
    influencerSocialProfile?: SearchTableInfluencer;
};
