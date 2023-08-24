import { useDB } from 'src/utils/client-db/use-client-db';

import { getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall } from 'src/utils/api/db/calls/sequence-influencers';
import useSWR from 'swr';
import { useUser } from './use-user';

/**
 * Because our search page only uses these two bits of information to determine if an influencer has already been added to a sequence, we don't need to get the full influencer and sequence objects
 */
export type AllSequenceInfluencersIqDataIdsAndSequenceNames = {
    iqdata_id: string;
    sequenceName?: string;
};

export const useAllSequenceInfluencersIqDataIdAndSequenceName = () => {
    const { profile } = useUser();
    const fetchCall = useDB<typeof getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall>(
        getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall,
    );
    const { data, mutate: refresh } = useSWR(
        profile?.company_id ? [profile.company_id, 'allSequenceInfluencersIqDataIdsAndSequenceNames'] : null,
        ([companyId]) => fetchCall(companyId),
    );
    const allSequenceInfluencersIqDataIdsAndSequenceNames: AllSequenceInfluencersIqDataIdsAndSequenceNames[] =
        data?.map((influencer) => ({
            iqdata_id: influencer.iqdata_id,
            sequenceName: influencer.sequences?.name,
        })) ?? [];
    return {
        allSequenceInfluencersIqDataIdsAndSequenceNames,
        refresh,
    };
};
