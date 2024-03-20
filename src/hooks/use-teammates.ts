import type { CompanyTeammatesGetQueries, CompanyTeammatesGetResponse } from 'pages/api/company/teammates';
import { nextFetchWithQueries } from 'src/utils/fetcher';

import { useCompany } from './use-company';
import { useCallback, useEffect, useState } from 'react';
import awaitToError from 'src/utils/await-to-error';
import { apiFetch } from 'src/utils/api/api-fetch';
import { useApiClient } from 'src/utils/api-client/request';

export const useTeammates = () => {
    const { company } = useCompany();

    const { apiClient } = useApiClient();

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

    const deleteTeammate = (adminId: string, teammateId: string) => {
        return apiClient.delete(`v2/company/teammates?adminId=${adminId}&teammateId=${teammateId}`);
    };

    useEffect(() => {
        refreshTeammates();
    }, [refreshTeammates]);

    return {
        teammates,
        refreshTeammates,
        updateTeammate,
        deleteTeammate,
    };
};
