import useSWR from 'swr';
import { useCompany } from './use-company';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { getSequenceInfluencersByCompanyIdCall } from 'src/utils/api/db/calls/sequence-influencers';
import { useMemo } from 'react';

export const useSequences = () => {
    const { company } = useCompany();
    const db = useClientDb();

    if (!company) throw new Error('No company found');

    const { data: sequences, mutate: refreshSequences } = useSWR(
        'sequences',
        () => db.getSequencesByCompanyId(company.id),
        { revalidateOnFocus: false, revalidateIfStale: false },
    );

    const getSequenceInfluencersByCompanyIdDBCall = useDB<typeof getSequenceInfluencersByCompanyIdCall>(
        getSequenceInfluencersByCompanyIdCall,
    );
    const { data: allSequenceInfluencersByCompanyId } = useSWR('sequence_influencers', () =>
        getSequenceInfluencersByCompanyIdDBCall(company.id),
    );

    const allSequenceIds = useMemo(() => sequences?.map((sequence) => sequence.id), [sequences]);

    return {
        sequences,
        refreshSequences,
        allSequenceInfluencersByCompanyId,
        allSequenceIds,
    };
};
