import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { SubscriptionEntity } from './subscription-entity';
import type { EntityManager, EntityTarget } from 'typeorm';
import type Stripe from 'stripe';

@InjectInitializeDatabaseOnAllProps
export default class SubscriptionRepository extends BaseRepository<SubscriptionEntity<Stripe.Subscription>> {
    static repository = new SubscriptionRepository();
    static getRepository(): SubscriptionRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SubscriptionRepository>(SubscriptionRepository.name);
            if (contextRepository) {
                return contextRepository as SubscriptionRepository;
            }
            const repository = new SubscriptionRepository(SubscriptionEntity, manager);
            RequestContext.registerRepository(SubscriptionRepository.name, repository);
            return repository;
        }
        return SubscriptionRepository.repository;
    }
    constructor(target: EntityTarget<SubscriptionEntity> = SubscriptionEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
