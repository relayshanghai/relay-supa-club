import type { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useApiClient } from 'src/utils/api-client/request';
import { type CreditType } from 'types/credit';

export const useUsageV2 = () => {
    const { apiClient, loading, error } = useApiClient();
    const [usages, setUsages] = useState<CreditType>({
        profile: 0,
        search: 0,
        export: 0,
    });

    useEffect(() => {
        getUsage()
            .then((data) => {
                setUsages(data);
            })
            .catch(() => {
                setUsages({
                    profile: 0,
                    search: 0,
                    export: 0,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUsage = useCallback(async () => {
        const response = await apiClient.get<AxiosError, AxiosResponse<CreditType>>('/v2/usages');
        return response.data;
    }, [apiClient]);
    return { refreshUsage: getUsage, usages, loading, error };
};
