import qs from 'query-string';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BillingPeriod, Currency, PriceType, type PlanEntity } from 'src/backend/database/plan/plan-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export const initialPlanData = {
    id: '',
    itemName: '',
    priceType: PriceType.TOP_UP,
    currency: Currency.CNY,
    billingPeriod: BillingPeriod.ONE_TIME,
    price: 0,
    originalPrice: 0,
    existingUserPrice: 0,
    priceId: '',
    originalPriceId: '',
    existingUserPriceId: '',
    profiles: 0,
    searches: 0,
    exports: 0,
    isActive: false,
} as PlanEntity;

export const usePlans = () => {
    const { apiClient, loading, error } = useApiClient();
    const [planData, setPlanData] = useState<PlanEntity>(initialPlanData);
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
            toast.error('Error saving plans');
            return;
        }
        toast.success(`Plan ${data.id ? 'Updated' : 'Created'} successfully`);
        setPlans([...plans, response.data]);
        return response.data;
    };

    return {
        plans,
        getPlans,
        createPlan,
        loading,
        error,
        planData,
        setPlanData,
    };
};
