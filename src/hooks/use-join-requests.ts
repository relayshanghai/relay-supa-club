import { useState } from 'react';
import { type CompanyJoinRequestEntity } from 'src/backend/database/company-join-request/company-join-request-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export const useJoinRequests = () => {
    const { apiClient, loading, error } = useApiClient();
    const [joinRequests, setJoinRequests] = useState<CompanyJoinRequestEntity[]>([]);

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
        return response.data;
    };

    const ignoreRequest = async (id: string) => {
        const [err, response] = await awaitToError(
            apiClient.delete<CompanyJoinRequestEntity[]>(`/join-requests/${id}`),
        );
        if (err) {
            throw err;
        }
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
