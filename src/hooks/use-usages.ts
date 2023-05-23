import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';

export const useUsages = (useRange?: boolean, startDate?: string, endDate?: string) => {
    const clientRoleData = useAtomValue(clientRoleAtom);

    const { data: usages, mutate: refreshUsages } = useSWR(
        clientRoleData?.companyId ? ['usages', startDate, endDate] : null,
        async ([path, startDate, endDate]) => {
            if (!clientRoleData?.companyId) {
                return;
            }
            if (useRange && (!startDate || !endDate)) {
                return;
            }
            const body = { startDate, endDate, id: clientRoleData.companyId };
            return await nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, body);
        },
    );

    return {
        usages,
        refreshUsages,
    };
};
