import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useUsages = () => {
    const { profile } = useUser();
    const { data: usages, mutate: refreshUsages } = useSWR(
        profile?.company_id ? 'company' : null,
        (path) =>
            nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, {
                id: profile?.company_id ?? '',
            }),
    );

    return {
        usages,
        refreshUsages,
    };
};
