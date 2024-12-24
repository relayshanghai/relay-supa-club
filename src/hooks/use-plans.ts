import qs from 'query-string';
import { useState } from 'react';
import { type PlanEntity } from 'src/backend/database/plan/plan-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export const usePlans = () => {
    const { apiClient, loading, error } = useApiClient();
    const [plans, setPlans] = useState<PlanEntity[]>([]);

    const getPlans = async (type: string | null = 'top-up') => {
        const query = qs.stringify({ type });
        const [err, response] = await awaitToError(apiClient.get<PlanEntity[]>(`/plans?${query}`));
        if (err) {
            throw err;
        }
        setPlans(response.data);
        return response.data;
    };

    const createPlan = async (data: PlanEntity) => {
        const id = data.id;
        let p: Promise<any>;
        if (id) {
            p = apiClient.put<PlanEntity>(`/plans/${id}`, data);
        } else {
            p = apiClient.post<PlanEntity>('/plans', data);
        }
        const [err, response] = await awaitToError(p);
        if (err) {
            throw err;
        }
        setPlans([...plans, response.data]);
        return response.data;
    };

    return {
        plans,
        getPlans,
        createPlan,
        loading,
        error,
    };
};
