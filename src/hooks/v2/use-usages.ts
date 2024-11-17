import type { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useApiClient } from 'src/utils/api-client/request';
import { type CreditType } from 'types/credit';

export const useUsageV2 = () => {
    const { apiClient, loading, error } = useApiClient();
    const [usages, setUsages] = useState<CreditType>({
        profile: 0,
        search: 0,
    });

    useEffect(() => {
        getUsage().then((data) => {
            setUsages(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUsage = async () => {
        const response = await apiClient.get<AxiosError, AxiosResponse<CreditType>>('/v2/usages');
        return response.data;
    };
    return { refreshUsage: getUsage, usages, loading, error };
};
