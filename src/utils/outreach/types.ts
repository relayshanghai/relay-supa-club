import type { addresses, sequence_influencers, sequences, threads } from 'drizzle/schema';
import type { FUNNEL_STATUS } from './constants';
import type { CreatorPlatform } from 'types';

export type EmailContact = { address: string; name?: string };

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

/**
 * Contains Thread data
 */
export type Thread = {
    threadInfo: typeof threads.$inferSelect;
    sequenceInfluencers: InfluencerOutreachData | null;
    sequenceInfo: Outreach | null;
};
