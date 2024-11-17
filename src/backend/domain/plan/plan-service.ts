import { PriceType, type PlanEntity } from 'src/backend/database/plan/plan-entity';
import PlanRepository from 'src/backend/database/plan/plan-repository';

export default class PlanService {
    public static readonly service: PlanService = new PlanService();
    static getService(): PlanService {
        return PlanService.service;
    }

    async getPlans(): Promise<PlanEntity[]> {
        const plans = await PlanRepository.getRepository().find({
            where: {
                isActive: true,
                priceType: PriceType.TOP_UP,
            },
        });
        return plans;
    }
}
