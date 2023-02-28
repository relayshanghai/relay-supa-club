import type {
    CompanyTeammatesGetQueries,
    CompanyTeammatesGetResponse,
} from 'pages/api/company/teammates';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';

import { useUser } from './use-user';

export const useTeammates = () => {
    const { profile } = useUser();
    const { data: teammates, mutate: refreshTeammates } = useSWR(
        profile?.company_id ? 'company/teammates' : null,
        (path) =>
            nextFetchWithQueries<CompanyTeammatesGetQueries, CompanyTeammatesGetResponse>(path, {
                id: profile?.company_id ?? '',
            }),
    );

    return {
        teammates,
        refreshTeammates,
    };
};
