import type { CreatorReport } from 'types';
import { insertInfluencer, insertInfluencerProfile } from './api/db/calls/influencers';
import { extractInfluencer, extractInfluencerProfile } from './api/iqdata/extract-influencer';

export const saveInfluencer = (data: CreatorReport) => {
    const influencer = insertInfluencer(extractInfluencer(data.user_profile));
    insertInfluencerProfile(extractInfluencerProfile(data.user_profile)(influencer));

    return influencer;
};
