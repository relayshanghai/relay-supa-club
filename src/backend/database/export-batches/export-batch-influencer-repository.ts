import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { In, type EntityManager, type EntityTarget } from 'typeorm';
import { ExportBatchInfluencerEntity } from './export-batch-influencer-entity';

@InjectInitializeDatabaseOnAllProps
export class ExportBatchInfluencerRepository extends BaseRepository<ExportBatchInfluencerEntity> {
    static repository: ExportBatchInfluencerRepository = new ExportBatchInfluencerRepository();
    static getRepository(): ExportBatchInfluencerRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<ExportBatchInfluencerRepository>(
                ExportBatchInfluencerRepository.name,
            );
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new ExportBatchInfluencerRepository(ExportBatchInfluencerEntity, manager);
            RequestContext.registerRepository(ExportBatchInfluencerRepository.name, repository);
            return repository;
        }
        return ExportBatchInfluencerRepository.repository;
    }
    constructor(
        target: EntityTarget<ExportBatchInfluencerEntity> = ExportBatchInfluencerEntity,
        manager?: EntityManager,
    ) {
        super(target, manager);
    }
    getByIds(ids: string[]): Promise<ExportBatchInfluencerEntity[]> {
        return this.find({
            where: {
                iqDataReferenceId: In(ids),
            },
        });
    }
}
