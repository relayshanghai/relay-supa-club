import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useInfluencerSocialProfile = (id?: string) => {
    const db = useClientDb();
    const { data: influencerSocialProfile, mutate: refreshInfluencer } = useSWR(
        id ? [id, 'influencer-social-profile'] : null,
        ([id]) => db.getInfluencerSocialProfileById(id),
    );

    return {
        influencerSocialProfile,
        refreshInfluencer,
    };
};
