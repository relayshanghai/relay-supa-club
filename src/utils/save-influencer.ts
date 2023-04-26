import type { CreatorReport } from 'types';
import { insertInfluencer, insertInfluencerProfile } from './api/db/calls/influencers';
import { extractInfluencer, extractInfluencerProfile } from './api/iqdata/extract-influencer';

export const saveInfluencer = async (data: CreatorReport) => {
    const influencer = await insertInfluencer(extractInfluencer(data.user_profile));
    await insertInfluencerProfile(extractInfluencerProfile(data.user_profile)(influencer));

    return influencer;
};
