import type { CreatorReport } from 'types';
import { insertInfluencer, insertInfluencerSocialProfile } from './api/db/calls/influencers';
import { extractInfluencer, extractInfluencerSocialProfile } from './api/iqdata/extract-influencer';

export const saveInfluencer = async (data: CreatorReport) => {
    const influencer = await insertInfluencer(extractInfluencer(data.user_profile));

    const socialProfile = await insertInfluencerSocialProfile(
        extractInfluencerSocialProfile(data.user_profile)(influencer),
    );

    return [influencer, socialProfile];
};
