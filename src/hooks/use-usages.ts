import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useCompany } from './use-company';

export const useUsages = (useRange?: boolean, startDate?: string, endDate?: string) => {
    const { company } = useCompany();

    const { data: usages, mutate: refreshUsages } = useSWR(
        company?.id ? ['usages', startDate, endDate] : null,
        async ([path, startDate, endDate]) => {
            if (!company?.id) {
                return;
            }
            if (useRange && (!startDate || !endDate)) {
                return;
            }
            const body = { startDate, endDate, id: company?.id };
            return await nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, body);
        },
    );

    return {
        usages,
        refreshUsages,
    };
};
