import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import type { EntityManager, EntityTarget } from 'typeorm';
import { InfluencerEntity } from './influencer-entity';

@InjectInitializeDatabaseOnAllProps
export class InfluencerRepository extends BaseRepository<InfluencerEntity> {
    static repository: InfluencerRepository = new InfluencerRepository();
    static getRepository(): InfluencerRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<InfluencerRepository>(InfluencerRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new InfluencerRepository(InfluencerEntity, manager);
            RequestContext.registerRepository(InfluencerRepository.name, repository);
            return repository;
        }
        return InfluencerRepository.repository;
    }
    constructor(target: EntityTarget<InfluencerEntity> = InfluencerEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
