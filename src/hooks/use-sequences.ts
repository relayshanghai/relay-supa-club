import useSWR from 'swr';

import { useCompany } from './use-company';
import { useClientDb } from 'src/utils/client-db/use-client-db';

export const useSequences = () => {
    const { company } = useCompany();
    const db = useClientDb();
    const { data: sequences, mutate: refreshSequences } = useSWR(company?.id ? 'sequences' : null, () =>
        db.getSequencesByCompanyId(company?.id ?? ''),
    );

    return {
        sequences,
        refreshSequences,
    };
};
