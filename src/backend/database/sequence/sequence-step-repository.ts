import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import type { EntityManager, EntityTarget } from 'typeorm';
import { SequenceStepEntity } from './sequence-step-entity';

@InjectInitializeDatabaseOnAllProps
export default class SequenceStepRepository extends BaseRepository<SequenceStepEntity> {
    static repository = new SequenceStepRepository();
    static getRepository(): SequenceStepRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<SequenceStepRepository>(SequenceStepRepository.name);
            if (contextRepository) {
                return contextRepository as SequenceStepRepository;
            }
            const repository = new SequenceStepRepository(SequenceStepEntity, manager);
            RequestContext.registerRepository(SequenceStepRepository.name, repository);
            return repository;
        }
        return SequenceStepRepository.repository;
    }
    constructor(target: EntityTarget<SequenceStepEntity> = SequenceStepEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
