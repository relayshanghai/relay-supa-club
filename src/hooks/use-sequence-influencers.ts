import useSWR from 'swr';

import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import {
    deleteSequenceInfluencerCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
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

    const deleteSequenceInfluencerDBCall = useDB<typeof deleteSequenceInfluencerCall>(deleteSequenceInfluencerCall);
    const deleteSequenceInfluencer = async (id: string) => {
        const res = await deleteSequenceInfluencerDBCall(id);
        refreshSequenceInfluencers();
        return res;
    };

    return {
        sequenceInfluencers,
        updateSequenceInfluencer,
        refreshSequenceInfluencers,
        deleteSequenceInfluencer,
    };
};
