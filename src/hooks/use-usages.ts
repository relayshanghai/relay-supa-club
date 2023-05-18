import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useUsages = (useRange?: boolean, startDate?: string, endDate?: string) => {
    const { profile } = useUser();

    const { data: usages, mutate: refreshUsages } = useSWR(
        profile?.company_id ? ['usages', startDate, endDate] : null,
        async ([path, startDate, endDate]) => {
            if (!profile?.company_id) {
                return;
            }
            if (useRange && (!startDate || !endDate)) {
                return;
            }
            const body = { startDate, endDate, id: profile.company_id };
            return await nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, body);
        },
    );

    return {
        usages,
        refreshUsages,
    };
};
