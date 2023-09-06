import useSWR from 'swr';
import { useCompany } from './use-company';
import { useDB } from 'src/utils/client-db/use-client-db';

import { useMemo } from 'react';
import { getSequencesByCompanyIdCall } from 'src/utils/api/db/calls/sequences';

export const useSequences = () => {
    const { company } = useCompany();
    const getSequencesByCompanyId = useDB(getSequencesByCompanyIdCall);

    const { data: sequences, mutate: refreshSequences } = useSWR(
        company?.id ? [company.id, 'sequences'] : null,
        ([companyId]) => getSequencesByCompanyId(companyId),
        { revalidateOnFocus: false, revalidateIfStale: false },
    );
    console.log({ sequences });

    const allSequenceIds = useMemo(() => sequences?.map((sequence) => sequence.id), [sequences]);
    return {
        sequences,
        refreshSequences,
        allSequenceIds,
    };
};
