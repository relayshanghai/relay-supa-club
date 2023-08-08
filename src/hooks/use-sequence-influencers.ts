import useSWR from 'swr';

import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { updateSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';
import type { SequenceInfluencerUpdate } from 'src/utils/api/db';

export const useSequenceInfluencers = (sequenceId?: string) => {
    const db = useClientDb();
    const { data: sequenceInfluencers, mutate: refreshSequenceInfluencers } = useSWR(
        sequenceId ? 'sequence_influencers' : null,
        () => db.getSequenceInfluencersBySequenceId(sequenceId ?? ''),
    );

    const updateSequenceInfluencerDBCall = useDB(updateSequenceInfluencerCall);
    const updateSequenceInfluencer = async (update: SequenceInfluencerUpdate) => {
        const res = await updateSequenceInfluencerDBCall(update);

        refreshSequenceInfluencers();

        return res;
    };

    return {
        sequenceInfluencers,
        updateSequenceInfluencer,
        refreshSequenceInfluencers,
    };
};
