import { type CompanyJoinRequestEntity } from 'src/backend/database/company-join-request/company-join-request-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { useTeammates } from './use-teammates';
import { useTeammatesStore } from 'src/store/reducers/teammates';

export const useJoinRequests = () => {
    const { apiClient, loading, error } = useApiClient();
    const { refreshTeammates } = useTeammates();
    const { joinRequests, setJoinRequests } = useTeammatesStore();

    const getJoinRequests = async () => {
        const [err, response] = await awaitToError(apiClient.get<CompanyJoinRequestEntity[]>(`/join-requests`));
        if (err) {
            throw err;
        }
        setJoinRequests(response.data);
        return response.data;
    };

    const acceptRequest = async (id: string) => {
        const [err, response] = await awaitToError(apiClient.put<CompanyJoinRequestEntity[]>(`/join-requests/${id}`));
        if (err) {
            throw err;
        }
        await awaitToError(Promise.all([refreshTeammates(), getJoinRequests()]));
        return response.data;
    };

    const ignoreRequest = async (id: string) => {
        const [err, response] = await awaitToError(
            apiClient.delete<CompanyJoinRequestEntity[]>(`/join-requests/${id}`),
        );
        if (err) {
            throw err;
        }
        await awaitToError(Promise.all([getJoinRequests()]));
        return response.data;
    };

    return {
        joinRequests,
        getJoinRequests,
        acceptRequest,
        ignoreRequest,
        loading,
        error,
    };
};
