import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useInfluencerSocialProfile = (influencerSocialProfileId?: string) => {
    const db = useClientDb();
    const { data: influencerSocialProfile, mutate: refreshInfluencerSocialProfile } = useSWR(
        influencerSocialProfileId ? [influencerSocialProfileId, 'influencer-social-profile'] : null,
        ([id]) => db.getInfluencerSocialProfileById(id),
    );

    return {
        influencerSocialProfile,
        refreshInfluencerSocialProfile,
    };
};
