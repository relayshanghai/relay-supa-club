import { type CreatePlanRequest, type GetPlansQuery } from 'pages/api/plans/request';
import { Currency, PlanEntity, PriceType } from 'src/backend/database/plan/plan-entity';
import PlanRepository from 'src/backend/database/plan/plan-repository';
import { type FindOptionsWhere } from 'typeorm';
import type { PlanSummary } from 'types/plans';

export default class PlanService {
    public static readonly service: PlanService = new PlanService();
    static getService(): PlanService {
        return PlanService.service;
    }

    async getPlanSummaries(query: GetPlansQuery): Promise<PlanSummary[] | PlanEntity[]> {
        const where: FindOptionsWhere<PlanEntity> = {};
        const summarizedPlans = query.summarized ?? false;
        switch (query.type) {
            case 'top-up':
                where.isActive = true;
                where.priceType = PriceType.TOP_UP;
                break;
            case 'subscription':
                where.isActive = true;
                where.priceType = PriceType.SUBSCRIPTION;
                break;
            case 'all':
                where.isActive = true;
                break;
            default:
                where.isActive = true;
                break;
        }
        const plans = await PlanRepository.getRepository().find({
            where,
            order: {
                profiles: 'ASC',
                searches: 'ASC',
                exports: 'ASC',
            },
        });

        if (!summarizedPlans) {
            return plans;
        }

        const sortedPlans = plans.sort((a) => (a.currency === Currency.CNY ? -1 : 1));
        const reducedPlans = sortedPlans.reduce((acc, plan) => {
            acc[plan.itemName] = plan;
            return acc;
        }, {} as Record<string, PlanEntity>);
        const plansData = Object.values(reducedPlans);

        return plansData.map((plan) => ({
            itemName: plan.itemName,
            priceType: plan.priceType,
            billingPeriod: plan.billingPeriod,
            profiles: plan.profiles,
            searches: plan.searches,
            exports: plan.exports,
            details: plans
                .filter((p) => p.itemName === plan.itemName)
                .map((p) => ({
                    currency: p.currency,
                    price: p.price,
                    priceId: p.priceId,
                    originalPrice: p.originalPrice,
                    originalPriceId: p.originalPriceId,
                    existingUserPrice: p.existingUserPrice,
                    existingUserPriceId: p.existingUserPriceId,
                    isActive: p.isActive,
                    id: p.id,
                })),
        }));
    }

    async createPlan(data: CreatePlanRequest): Promise<PlanEntity> {
        const planEntity = new PlanEntity();
        planEntity.itemName = data.itemName;
        planEntity.priceType = data.priceType;
        planEntity.billingPeriod = data.billingPeriod;
        planEntity.price = data.price;
        planEntity.currency = data.currency;
        planEntity.priceId = data.priceId;
        planEntity.originalPrice = (data.originalPrice ?? 0) > 0 ? data.originalPrice : null;
        planEntity.originalPriceId = data.originalPriceId !== '' ? data.originalPriceId : null;
        planEntity.existingUserPrice = (data.existingUserPrice ?? 0) > 0 ? data.existingUserPrice : null;
        planEntity.existingUserPriceId = data.existingUserPriceId !== '' ? data.existingUserPriceId : null;
        planEntity.profiles = data.profiles;
        planEntity.searches = data.searches;
        planEntity.exports = data.exports;
        planEntity.isActive = data.isActive;
        const plan = await PlanRepository.getRepository().save(planEntity);
        return plan;
    }

    async updatePlan(id: string, data: CreatePlanRequest): Promise<PlanEntity> {
        const existingPlan = await PlanRepository.getRepository().findOne({
            where: {
                id,
            },
        });
        const plan = await PlanRepository.getRepository().save({ ...existingPlan, ...data });
        return plan;
    }
}
