import { useDB } from 'src/utils/client-db/use-client-db';

import { getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall } from 'src/utils/api/db/calls/sequence-influencers';
import useSWR from 'swr';
import { useUser } from './use-user';

/**
 * Because our search page only uses these two bits of information to determine if an influencer has already been added to a sequence, we don't need to get the full influencer and sequence objects
 */
export type AllSequenceInfluencersBasicInfo = {
    id: string;
    iqdata_id: string;
    sequenceName?: string;
    email: string | null;
};
type DBResponseInfluencer = {
    id: string;
    iqdata_id: string;
    email: string | null;
    sequences: {
        name: string;
        deleted: boolean;
    } | null;
};

export const useAllSequenceInfluencersBasicInfo = () => {
    const { profile } = useUser();
    const fetchCall = useDB<typeof getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall>(
        getSequenceInfluencersIqDataIdAndSequenceNameByCompanyIdCall,
    );
    const { data, mutate: refresh } = useSWR(
        profile?.company_id ? [profile.company_id, 'allSequenceInfluencersIqDataIdsAndSequenceNames'] : null,
        ([companyId]) => fetchCall(companyId),
    );
    const allSequenceInfluencersIqDataIdsAndSequenceNames: AllSequenceInfluencersBasicInfo[] =
        data?.map(({ sequences, ...influencer }) => ({
            sequenceName: sequences?.name,
            ...influencer,
        })) ?? [];
    const refresher = (data: AllSequenceInfluencersBasicInfo[]) => {
        const formattedData: DBResponseInfluencer[] = data.map(({ sequenceName, ...influencer }) => ({
            sequences: sequenceName ? { name: sequenceName, deleted: false } : null,
            ...influencer,
        }));
        refresh(formattedData);
    };

    return {
        allSequenceInfluencersIqDataIdsAndSequenceNames,
        refresh: refresher,
    };
};
