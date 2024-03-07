import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { SequenceEntity } from './sequence-entity';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class SequenceRepository extends BaseRepository<SequenceEntity> {
    static repository: SequenceRepository = new SequenceRepository();
    static getRepository(): SequenceRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SequenceRepository>(SequenceRepository.name);
            if (contextRepository) {
                return contextRepository as SequenceRepository;
            }
            const repository = new SequenceRepository(SequenceEntity, manager);
            RequestContext.registerRepository(SequenceRepository.name, repository);
            return repository;
        }
        return SequenceRepository.repository;
    }
    constructor(target: EntityTarget<SequenceEntity> = SequenceEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
