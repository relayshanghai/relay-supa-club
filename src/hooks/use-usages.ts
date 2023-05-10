import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useCompany } from './use-company';

export const useUsages = () => {
    const { company } = useCompany();
    const { data: usages, mutate: refreshUsages } = useSWR(company?.id ? 'usages' : null, (path) =>
        nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, {
            id: company?.id ?? '',
        }),
    );

    return {
        usages,
        refreshUsages,
    };
};
