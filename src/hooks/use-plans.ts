import { useState } from 'react';
import { type PlanEntity } from 'src/backend/database/plan/plan-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export const usePlans = () => {
    const { apiClient, loading, error } = useApiClient();
    const [plans, setPlans] = useState<PlanEntity[]>([]);

    const getPlans = async () => {
        const [err, response] = await awaitToError(apiClient.get<PlanEntity[]>('/plans'));
        if (err) {
            throw err;
        }
        setPlans(response.data);
        return response.data;
    };

    return {
        plans,
        getPlans,
        loading,
        error,
    };
};
