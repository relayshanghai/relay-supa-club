import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ThreadEntity } from './thread-entity';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class ThreadRepository extends BaseRepository<ThreadEntity> {
    static repository = new ThreadRepository();
    static getRepository(): ThreadRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<ThreadRepository>(ThreadRepository.name);
            if (contextRepository) {
                return contextRepository as ThreadRepository;
            }
            const repository = new ThreadRepository(ThreadEntity, manager);
            RequestContext.registerRepository(ThreadRepository.name, repository);
            return repository;
        }
        return ThreadRepository.repository;
    }
    constructor(target: EntityTarget<ThreadEntity> = ThreadEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
