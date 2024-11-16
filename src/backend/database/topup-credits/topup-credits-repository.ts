import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import type { EntityManager, EntityTarget } from 'typeorm';
import { TopupCreditEntity } from './topup-credits-entity';

@InjectInitializeDatabaseOnAllProps
export default class TopupCreditRepository extends BaseRepository<TopupCreditEntity> {
    static readonly repository = new TopupCreditRepository();
    static getRepository(): TopupCreditRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<TopupCreditRepository>(TopupCreditRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new TopupCreditRepository(TopupCreditEntity, manager);
            RequestContext.registerRepository(TopupCreditRepository.name, repository);
            return repository;
        }
        return TopupCreditRepository.repository;
    }
    constructor(target: EntityTarget<TopupCreditEntity> = TopupCreditEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
