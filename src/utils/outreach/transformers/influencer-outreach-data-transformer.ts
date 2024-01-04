import type { sequence_influencers } from 'drizzle/schema';
import { CreatorPlatform } from 'types';
import { FUNNEL_STATUS } from '../constants';
import type { InfluencerOutreachData } from '../types';

/**
 * Transforms and validates sequence_influencer rows to {@link InfluencerOutreachData|`InfluencerOutreachData`} types
 */
export const influencerOutreachDataTransformer = (
    sequenceInfluencer: typeof sequence_influencers.$inferSelect,
): InfluencerOutreachData => {
    const funnel_status = FUNNEL_STATUS.parse(sequenceInfluencer.funnel_status);
    const platform = CreatorPlatform.parse(sequenceInfluencer.platform);

    // @bug recent_post data is empty
    return { ...sequenceInfluencer, platform, funnel_status, recent_post_title: '', recent_post_url: '' };
};
