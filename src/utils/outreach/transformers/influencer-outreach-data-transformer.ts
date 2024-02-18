import type { influencer_social_profiles, sequence_influencers } from 'drizzle/schema';
import { CreatorPlatform } from 'types';
import { FUNNEL_STATUS } from '../constants';
import type { InfluencerOutreachData } from '../types';

/**
 * Transforms and validates sequence_influencer rows to {@link InfluencerOutreachData|`InfluencerOutreachData`} types
 */
export const influencerOutreachDataTransformer = (
    sequenceInfluencer: typeof sequence_influencers.$inferSelect,
    influencer?: typeof influencer_social_profiles.$inferSelect | null,
): InfluencerOutreachData => {
    const funnel_status = FUNNEL_STATUS.parse(sequenceInfluencer.funnel_status);
    const platform = CreatorPlatform.parse(sequenceInfluencer.platform);

    const recentPosts = influencer
        ? { recent_post_title: influencer.recent_post_title ?? '', recent_post_url: influencer.recent_post_url ?? '' }
        : { recent_post_title: '', recent_post_url: '' };

    return { ...sequenceInfluencer, platform, funnel_status, ...recentPosts };
};
