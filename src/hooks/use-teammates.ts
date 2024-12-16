import { useCompany } from './use-company';
import { useCallback, useEffect } from 'react';
import awaitToError from 'src/utils/await-to-error';
import { useApiClient } from 'src/utils/api-client/request';
import { type ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { useTeammatesStore } from 'src/store/reducers/teammates';

export const useTeammates = () => {
    const { company } = useCompany();

    const { apiClient } = useApiClient();

    const { teammates, setTeammates } = useTeammatesStore();

    const refreshTeammates = useCallback(async () => {
        if (!company?.id) {
            return;
        }
        const [, result] = await awaitToError(apiClient.get<ProfileEntity[]>('/v2/company/teammates'));
        if (!result.data) {
            return;
        }
        const data = result.data;
        data.sort((a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()));
        setTeammates(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teammates.length, company?.id]);

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
