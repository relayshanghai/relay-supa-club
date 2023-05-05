import type { CreatorReport } from 'types';
import type { InfluencerRow, InfluencerSocialProfileRow } from './api/db/calls/influencers';
import { insertInfluencer, insertInfluencerSocialProfile } from './api/db/calls/influencers';
import { extractInfluencer, extractInfluencerSocialProfile } from './api/iqdata/extract-influencer';

export const saveInfluencer = async (
    data: CreatorReport,
): Promise<[InfluencerRow, InfluencerSocialProfileRow] | [null, null]> => {
    const influencer = await insertInfluencer(extractInfluencer(data.user_profile));

    if (influencer === null) return [null, null];

    const socialProfile = await insertInfluencerSocialProfile(
        extractInfluencerSocialProfile(data.user_profile)(influencer),
    );

    if (socialProfile === null) return [null, null];

    return [influencer, socialProfile];
};
