import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useInfluencer = (id?: string) => {
    const db = useClientDb();
    const { data: influencer, mutate: refreshInfluencer } = useSWR(id ? [id, 'influencer'] : null, ([id]) =>
        db.getInfluencerById(id),
    );

    return {
        influencer,
        refreshInfluencer,
    };
};
