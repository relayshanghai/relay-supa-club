import { useDB } from 'src/utils/client-db/use-client-db';

import { useSequences } from './use-sequences';
import { getSequenceInfluencersIqDataIdAndSequenceNameBySequenceIdCall } from 'src/utils/api/db/calls/sequence-influencers';
import useSWR from 'swr';

/**
 * Because our search page only uses these two bits of information to determine if an influencer has already been added to a sequence, we don't need to get the full influencer and sequence objects
 */
export type AllSequenceInfluencersIqDataIdsAndSequenceNames = {
    iqdata_id: string;
    sequenceName?: string;
};

export const SequenceInfluencersIqDataIdAndSequenceName = () => {
    const { sequences } = useSequences();
    const fetchCall = useDB<typeof getSequenceInfluencersIqDataIdAndSequenceNameBySequenceIdCall>(
        getSequenceInfluencersIqDataIdAndSequenceNameBySequenceIdCall,
    );
    const { data } = useSWR(
        sequences ? [sequences, 'allSequenceInfluencersIqDataIdsAndSequenceNames'] : null,
        ([sequences]) => fetchCall(sequences.map((sequence) => sequence.id)),
    );
    const allSequenceInfluencersIqDataIdsAndSequenceNames: AllSequenceInfluencersIqDataIdsAndSequenceNames[] =
        data?.map((influencer) => ({
            iqdata_id: influencer.iqdata_id ?? '',
            sequenceName: influencer.sequences?.name,
        })) ?? [];
    return {
        allSequenceInfluencersIqDataIdsAndSequenceNames,
    };
};
