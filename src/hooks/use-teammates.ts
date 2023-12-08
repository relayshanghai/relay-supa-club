import type { CompanyTeammatesGetQueries, CompanyTeammatesGetResponse } from 'pages/api/company/teammates';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';

import { useCompany } from './use-company';

export const useTeammates = () => {
    const { company } = useCompany();
    const { data: teammates, mutate: refreshTeammates } = useSWR(
        company?.id ? [company.id, 'company/teammates'] : null,
        async ([id, path]) => {
            const result = await nextFetchWithQueries<CompanyTeammatesGetQueries, CompanyTeammatesGetResponse>(path, {
                id,
            });
            result.sort((a, b) => a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase()));

            return result;
        },
    );

    return {
        teammates,
        refreshTeammates,
    };
};
