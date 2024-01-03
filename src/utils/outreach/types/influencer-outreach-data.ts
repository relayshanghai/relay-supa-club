import type { sequence_influencers } from 'drizzle/schema';
import type { FUNNEL_STATUS } from '../constants';
import type { CreatorPlatform } from 'types';

// Holds the outreach data of the current influencer in that outreach
export type InfluencerOutreachData = typeof sequence_influencers.$inferSelect & {
    funnel_status: FUNNEL_STATUS;
    platform: CreatorPlatform;
    recent_post_title: string;
    recent_post_url: string;
};
