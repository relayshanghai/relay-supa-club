import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { PriceEntity, SubscriptionBillingPeriod, type SubscriptionType } from './price-entity';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class PriceRepository extends BaseRepository<PriceEntity> {
    static readonly repository = new PriceRepository();
    static getRepository(): PriceRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<PriceRepository>(PriceRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new PriceRepository(PriceEntity, manager);
            RequestContext.registerRepository(PriceRepository.name, repository);
            return repository;
        }
        return PriceRepository.repository;
    }
    constructor(target: EntityTarget<PriceEntity> = PriceEntity, manager?: EntityManager) {
        super(target, manager);
    }
    getPriceByType(type: SubscriptionType) {
        return this.find({
            where: {
                subscriptionType: type,
                billingPeriod: SubscriptionBillingPeriod.MONTHLY,
            },
        });
    }
}
