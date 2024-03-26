import type { CompanyTeammatesGetQueries, CompanyTeammatesGetResponse } from 'pages/api/company/teammates';
import { nextFetchWithQueries } from 'src/utils/fetcher';

import { useCompany } from './use-company';
import { useCallback, useEffect, useState } from 'react';
import awaitToError from 'src/utils/await-to-error';
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

    const updateTeammate = useCallback(
        async (adminId: string, teammateId: string, role: 'company_owner' | 'company_teammate') => {
            const [err] = await awaitToError(
                apiClient.put('v2/company/teammates', {
                    adminId,
                    teammateId,
                    role,
                }),
            );
            if (err) {
                throw err;
            }
        },
        [apiClient],
    );

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
