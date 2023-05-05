import type { influencerRow, influencerSocialProfileRow } from './api/db/calls/influencers';
import { getInfluencerById, getInfluencerSocialProfileByReferenceId } from './api/db/calls/influencers';

/**
 * Retrieves an influencer and their social profile based on a given reference ID.
 *
 * @param {Array<string>} referenceId - The reference ID to search for.
 *
 * @returns {Promise<Array<influencerRow, influencerSocialProfileRow> | Array<null, null>>}
 *  - An array containing the influencer and their social profile, or null values if not found.
 */
export const getInfluencerByReferenceId = async (
    referenceId: [string, string],
): Promise<[influencerRow, influencerSocialProfileRow] | [null, null]> => {
    const socialProfile = await getInfluencerSocialProfileByReferenceId(referenceId);

    if (socialProfile === null) return [null, null];

    const influencer = await getInfluencerById(socialProfile.influencer_id);

    if (influencer === null) return [null, null];

    return [influencer, socialProfile];
};
