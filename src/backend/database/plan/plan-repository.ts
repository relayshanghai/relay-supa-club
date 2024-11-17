import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import type { EntityManager, EntityTarget } from 'typeorm';
import { PlanEntity } from './plan-entity';

@InjectInitializeDatabaseOnAllProps
export default class PlanRepository extends BaseRepository<PlanEntity> {
    static readonly repository = new PlanRepository();
    static getRepository(): PlanRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<PlanRepository>(PlanRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new PlanRepository(PlanEntity, manager);
            RequestContext.registerRepository(PlanRepository.name, repository);
            return repository;
        }
        return PlanRepository.repository;
    }
    constructor(target: EntityTarget<PlanEntity> = PlanEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
