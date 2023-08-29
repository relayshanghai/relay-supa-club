import useSWR from 'swr';
import { useCompany } from './use-company';
import { useClientDb } from 'src/utils/client-db/use-client-db';

import { useMemo } from 'react';

export const useSequences = () => {
    const { company } = useCompany();
    const db = useClientDb();

    const { data: sequences, mutate: refreshSequences } = useSWR(
        company?.id ? [company.id, 'sequences'] : null,
        ([companyId]) => db.getSequencesByCompanyId(companyId),
        { revalidateOnFocus: false, revalidateIfStale: false },
    );

    const allSequenceIds = useMemo(() => sequences?.map((sequence) => sequence.id), [sequences]);
    return {
        sequences,
        refreshSequences,
        allSequenceIds,
    };
};
