import { type CreatePlanRequest, type GetPlansQuery } from 'pages/api/plans/request';
import { PriceType, type PlanEntity } from 'src/backend/database/plan/plan-entity';
import PlanRepository from 'src/backend/database/plan/plan-repository';
import { type FindOptionsWhere } from 'typeorm';

export default class PlanService {
    public static readonly service: PlanService = new PlanService();
    static getService(): PlanService {
        return PlanService.service;
    }

    async getPlans(query: GetPlansQuery): Promise<PlanEntity[]> {
        const where: FindOptionsWhere<PlanEntity> = {};
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
        return plans;
    }

    async createPlan(data: CreatePlanRequest): Promise<PlanEntity> {
        const plan = await PlanRepository.getRepository().save(data);
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
