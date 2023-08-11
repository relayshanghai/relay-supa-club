import { type SequenceInfluencer } from './../utils/api/db/types';
import useSWR from 'swr';
import { useClientDb } from 'src/utils/client-db/use-client-db';
import { apiFetch } from 'src/utils/api/api-fetch';

export const useSequenceInfluencers = (sequenceIds?: string[]) => {
    const db = useClientDb();

    const { data: sequenceInfluencers, mutate: refreshSequenceInfluencers } = useSWR(
        sequenceIds ? ['sequence_influencers', ...sequenceIds] : null,
        async () => {
            if (sequenceIds) {
                const ret = await apiFetch('/api/sequence/influencers', {
                    body: sequenceIds,
                });
                return ret as SequenceInfluencerManagerPage[];
            }
        },
    );

    return {
        sequenceInfluencers,
        updateSequenceInfluencer: db.updateSequenceInfluencer,
        refreshSequenceInfluencers,
    };
};

export type SequenceInfluencerManagerPage = SequenceInfluencer & {
    name?: string | null;
    manager_first_name?: string;
    username?: string;
    avatar_url?: string | null;
    url?: string;
};
