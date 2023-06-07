import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useCompany } from './use-company';
type StartEndDates = { thisMonthStartDate: Date; thisMonthEndDate: Date };
export const useUsages = (useRange?: boolean, startEndDates?: StartEndDates) => {
    const { company } = useCompany();

    const { data: usages, mutate: refreshUsages } = useSWR(
        company?.id ? ['usages', startEndDates?.thisMonthStartDate, startEndDates?.thisMonthEndDate] : null,
        async ([path, startDate, endDate]) => {
            if (!company?.id) {
                return;
            }
            if (useRange && (!startDate || !endDate)) {
                return;
            }
            const body = { startDate: startDate?.toISOString(), endDate: endDate?.toISOString(), id: company?.id };
            return await nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, body);
        },
    );

    return {
        usages,
        refreshUsages,
    };
};
