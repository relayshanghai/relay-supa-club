import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ThreadContactEntity } from './email-contact-entity';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class ThreadContactRepository extends BaseRepository<ThreadContactEntity> {
    static repository = new ThreadContactRepository();
    static getRepository(): ThreadContactRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<ThreadContactRepository>(
                ThreadContactRepository.name,
            );
            if (contextRepository) {
                return contextRepository as ThreadContactRepository;
            }
            const repository = new ThreadContactRepository(ThreadContactEntity, manager);
            RequestContext.registerRepository(ThreadContactRepository.name, repository);
            return repository;
        }
        return ThreadContactRepository.repository;
    }
    constructor(target: EntityTarget<ThreadContactEntity> = ThreadContactEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
