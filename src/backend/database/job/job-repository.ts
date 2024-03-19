import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { JobEntity } from './job-entity';
import { type EntityManager, type EntityTarget } from 'typeorm';

export default class JobRepository extends BaseRepository<JobEntity> {
    static repository = new JobRepository();
    static getRepository(): JobRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<JobRepository>(JobRepository.name);
            if (contextRepository) {
                return contextRepository as JobRepository;
            }
            const repository = new JobRepository(JobEntity, manager);
            RequestContext.registerRepository(JobRepository.name, repository);
            return repository;
        }
        return JobRepository.repository;
    }
    constructor(target: EntityTarget<JobEntity> = JobEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
