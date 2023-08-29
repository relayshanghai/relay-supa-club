import useSWR from 'swr';
import { useCompany } from './use-company';
import { useDB } from 'src/utils/client-db/use-client-db';
import { getSequenceInfluencersCountByCompanyIdCall } from 'src/utils/api/db/calls/sequence-influencers';
export const useAllSequenceInfluencersCountByCompany = () => {
    const { company } = useCompany();

    const getSequenceInfluencersCountByCompanyIdDBCall = useDB<typeof getSequenceInfluencersCountByCompanyIdCall>(
        getSequenceInfluencersCountByCompanyIdCall,
    );

    const { data: allSequenceInfluencersCount } = useSWR(
        company?.id ? [company.id, 'allSequenceInfluencersByCompanyId'] : null,
        ([companyId]) => getSequenceInfluencersCountByCompanyIdDBCall(companyId),
    );

    return { allSequenceInfluencersCount: allSequenceInfluencersCount || 0 };
};
