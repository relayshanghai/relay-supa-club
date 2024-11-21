/* eslint-disable react-hooks/exhaustive-deps */
import type { GetRelevantTopicsResponse } from 'pages/api/v2/platform/[platform]/influencers/[username]/response';
import { useEffect, useState } from 'react';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export const useRelevantTopics = (platform: string, username: string) => {
    const [topics, setTopics] = useState<GetRelevantTopicsResponse[]>([]);
    const { apiClient, loading } = useApiClient();

    const getRelevantTopics = async () => {
        const [err, data] = await awaitToError(
            apiClient.get<GetRelevantTopicsResponse[]>(`/v2/platform/${platform}/influencers/@${username}/topics`),
        );
        if (err) {
            return;
        }
        setTopics(data.data);
    };
    useEffect(() => {
        getRelevantTopics();
    }, [platform, username]);
    return {
        topics,
        loading,
    };
};
