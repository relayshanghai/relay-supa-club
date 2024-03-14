import type { CompanyTeammatesGetQueries, CompanyTeammatesGetResponse } from 'pages/api/company/teammates';
import { nextFetchWithQueries } from 'src/utils/fetcher';

import { useCompany } from './use-company';
import { useCallback, useEffect, useState } from 'react';
import awaitToError from 'src/utils/await-to-error';
import { apiFetch } from 'src/utils/api/api-fetch';

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

    const updateTeammate = useCallback(async (id: string, role: 'company_owner' | 'company_teammate') => {
        const [error] = await awaitToError(
            apiFetch(
                'api/company/teammates',
                { body: { id, role } },
                {
                    method: 'PUT',
                },
            ),
        );
        if (error) {
            return;
        }
    }, []);

    useEffect(() => {
        refreshTeammates();
    }, [refreshTeammates]);

    return {
        teammates,
        refreshTeammates,
        updateTeammate,
    };
};
