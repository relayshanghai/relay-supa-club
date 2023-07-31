import useSWR from 'swr';

import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useSequenceInfluencers = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequenceInfluencers, mutate: refreshSequenceInfluencers } = useSWR(
        sequenceId ? 'sequence_steps' : null,
        () => db.getSequenceInfluencersBySequenceId(sequenceId ?? ''),
    );

    return {
        sequenceInfluencers,
        updateSequenceInfluencer: db.updateSequenceInfluencer,
        refreshSequenceInfluencers,
    };
};
