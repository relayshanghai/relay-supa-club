import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import type { EntityManager, EntityTarget } from 'typeorm';
import { CompanyJoinRequestEntity } from './company-join-request-entity';

@InjectInitializeDatabaseOnAllProps
export class CompanyJoinRequestRepository extends BaseRepository<CompanyJoinRequestEntity> {
    static readonly repository = new CompanyJoinRequestRepository();
    static getRepository(): CompanyJoinRequestRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<CompanyJoinRequestRepository>(
                CompanyJoinRequestRepository.name,
            );
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new CompanyJoinRequestRepository(CompanyJoinRequestEntity, manager);
            RequestContext.registerRepository(CompanyJoinRequestRepository.name, repository);
            return repository;
        }
        return CompanyJoinRequestRepository.repository;
    }
    constructor(target: EntityTarget<CompanyJoinRequestEntity> = CompanyJoinRequestEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
