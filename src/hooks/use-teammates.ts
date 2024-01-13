import type { CompanyTeammatesGetQueries, CompanyTeammatesGetResponse } from 'pages/api/company/teammates';
import { nextFetchWithQueries } from 'src/utils/fetcher';

import { useCompany } from './use-company';
import { useCallback, useEffect, useState } from 'react';

export const useTeammates = () => {
    const { company } = useCompany();

    const [teammates, setTeammates] = useState<CompanyTeammatesGetResponse>([]);

    const refreshTeammates = useCallback(async () => {
        if (!company?.id) {
            return;
        }
        const result = await nextFetchWithQueries<CompanyTeammatesGetQueries, CompanyTeammatesGetResponse>(
            'company/teammates',
            {
                id: company.id,
            },
        );
        result.sort((a, b) => a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase()));

        setTeammates(result);
    }, [company?.id]);

    useEffect(() => {
        refreshTeammates();
    }, [refreshTeammates]);

    return {
        teammates,
        refreshTeammates,
    };
};
