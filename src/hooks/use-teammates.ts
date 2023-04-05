import type { CompanyTeammatesGetQueries, CompanyTeammatesGetResponse } from 'pages/api/company/teammates';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';

import { useUser } from './use-user';

export const useTeammates = () => {
    const { profile } = useUser();
    const { data: teammates, mutate: refreshTeammates } = useSWR(
        profile?.company_id ? 'company/teammates' : null,
        async (path) => {
            const result = await nextFetchWithQueries<CompanyTeammatesGetQueries, CompanyTeammatesGetResponse>(path, {
                id: profile?.company_id ?? '',
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
