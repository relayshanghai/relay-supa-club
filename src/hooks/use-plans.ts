import qs from 'query-string';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { PlanEntity } from 'src/backend/database/plan/plan-entity';
import { BillingPeriod, PriceType } from 'src/backend/database/plan/plan-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import type { PlanSummary } from 'types/plans';

export const initialPlanData = {
    id: '',
    itemName: '',
    priceType: PriceType.TOP_UP,
    billingPeriod: BillingPeriod.ONE_TIME,
    profiles: 0,
    searches: 0,
    exports: 0,
    details: [],
} as PlanSummary;

export const usePlans = () => {
    const { apiClient, loading, error } = useApiClient();
    const [planData, setPlanData] = useState<PlanSummary>(initialPlanData);
    const [planSummaries, setPlanSummaries] = useState<PlanSummary[]>([]);
    const [plans, setPlans] = useState<PlanEntity[]>([]);

    const getPlanSummaries = async () => {
        const query = qs.stringify({ summarized: true });
        const [err, response] = await awaitToError(apiClient.get<PlanSummary[]>(`/plans?${query}`));
        if (err) {
            throw err;
        }
        setPlanSummaries(response.data);
        return response.data;
    };

    const getPlans = async (type: string | null = 'top-up') => {
        const query = qs.stringify({ type });
        const [err, response] = await awaitToError(apiClient.get<PlanEntity[]>(`/plans?${query}`));
        if (err) {
            throw err;
        }
        setPlans(response.data);
        return response.data;
    };

    const createPlan = async (planSummary: PlanSummary) => {
        plans.push();
        const p: any[] = [] as any;
        for (const plan of planSummary.details) {
            const data = {
                id: plan.id ? plan.id : '',
                itemName: planSummary.itemName,
                priceType: planSummary.priceType,
                billingPeriod: planSummary.billingPeriod,
                currency: plan.currency,
                price: plan.price,
                priceId: plan.priceId,
                originalPrice: plan.originalPrice,
                originalPriceId: plan.originalPriceId,
                existingUserPrice: plan.existingUserPrice,
                existingUserPriceId: plan.existingUserPriceId,
                profiles: planSummary.profiles,
                searches: planSummary.searches,
                exports: planSummary.exports,
                isActive: true,
            } as PlanEntity;
            const id = data.id;
            if (id) {
                p.push(apiClient.put<PlanEntity>(`/plans/${id}`, data));
            } else {
                p.push(apiClient.post<PlanEntity>('/plans', data));
            }
        }

        const [err, response] = await awaitToError(Promise.all(p));
        if (err) {
            toast.error('Error saving plans');
            throw err;
        }
        toast.success(`Plan ${planSummary.details[0].id ? 'Updated' : 'Created'} successfully`);
        getPlanSummaries().then().catch();
        return response.map((r) => r.data);
    };

    return {
        plans,
        planSummaries,
        getPlanSummaries,
        getPlans,
        createPlan,
        loading,
        error,
        planData,
        setPlanData,
    };
};
