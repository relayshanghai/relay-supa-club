import type { CreatorReport } from 'types';
import type { InfluencerRow, InfluencerSocialProfileRow } from './api/db/calls/influencers';
import { getInfluencerById, getInfluencerSocialProfileByReferenceId } from './api/db/calls/influencers';
import { extractInfluencerReferenceId } from './api/iqdata/extract-influencer';

/**
 * Retrieves the influencer and their corresponding social profile by the given reference ID.
 *
 * @param {CreatorReport} data - The data containing the user profile.
 *
 * @returns {Promise<[InfluencerRow, InfluencerSocialProfileRow] | [null, null]>}
 * - The influencer and social profile, or null if they do not exist.
 */
export const getInfluencerByReferenceId = async (
    data: CreatorReport,
): Promise<[InfluencerRow, InfluencerSocialProfileRow] | [null, null]> => {
    const referenceId = extractInfluencerReferenceId(data.user_profile);
    const socialProfile = await getInfluencerSocialProfileByReferenceId(referenceId);

    if (socialProfile === null) return [null, null];

    const influencer = await getInfluencerById(socialProfile.influencer_id);

    if (influencer === null) return [null, null];

    return [influencer, socialProfile];
};
