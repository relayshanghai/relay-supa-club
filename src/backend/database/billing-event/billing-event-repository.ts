import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { BillingEventEntity } from './billing-event-entity';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class BillingEventRepository extends BaseRepository<BillingEventEntity> {
    static repository = new BillingEventRepository();
    static getRepository(): BillingEventRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<BillingEventRepository>(BillingEventRepository.name);
            if (contextRepository) {
                return contextRepository as BillingEventRepository;
            }
            const repository = new BillingEventRepository(BillingEventEntity, manager);
            RequestContext.registerRepository(BillingEventRepository.name, repository);
            return repository;
        }
        return BillingEventRepository.repository;
    }
    constructor(target: EntityTarget<BillingEventEntity> = BillingEventEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
