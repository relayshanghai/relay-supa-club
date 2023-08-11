import useSWR from 'swr';
import { useCompany } from './use-company';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { getSequenceInfluencersByCompanyIdCall } from 'src/utils/api/db/calls/sequence-influencers';

export const useSequences = () => {
    const { company } = useCompany();

    const db = useClientDb();
    const { data: sequences, mutate: refreshSequences } = useSWR(company?.id ? 'sequences' : null, () =>
        db.getSequencesByCompanyId(company?.id ?? ''),
    );
    if (!company) throw new Error('No company found');

    const getSequenceInfluencersByCompanyIdDBCall = useDB(getSequenceInfluencersByCompanyIdCall);
    const { data: allSequenceInfluencersByCompanyId } = useSWR(company.id ? 'sequence_influencers' : null, () =>
        getSequenceInfluencersByCompanyIdDBCall(company.id ?? ''),
    );

    return {
        sequences,
        refreshSequences,
        allSequenceInfluencersByCompanyId,
    };
};
