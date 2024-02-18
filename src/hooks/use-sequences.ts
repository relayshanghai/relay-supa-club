import useSWR from 'swr';
import { useCompany } from './use-company';
import { useDB } from 'src/utils/client-db/use-client-db';

import { useMemo } from 'react';
import { getSequencesByCompanyIdCall } from 'src/utils/api/db/calls/sequences';

export const useSequences = (params?: { filterDeleted?: boolean }) => {
    const { company } = useCompany();
    const getSequencesByCompanyId = useDB(getSequencesByCompanyIdCall);

    const { data: allSequences, mutate: refreshSequences } = useSWR(
        company?.id ? [company.id, 'sequences'] : null,
        ([companyId]) => getSequencesByCompanyId(companyId),
        {
            revalidateOnFocus: true,
        },
    );

    const sequences = params?.filterDeleted ? allSequences?.filter((sequence) => !sequence.deleted) : allSequences;

    const allSequenceIds = useMemo(
        () => (Array.isArray(sequences) ? sequences.map((sequence) => sequence.id) : []),
        [sequences],
    );
    return {
        sequences,
        refreshSequences,
        allSequenceIds,
    };
};
