import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { LessThanOrEqual, type EntityManager, type EntityTarget } from 'typeorm';
import { ExportBatchEntity, ExportBatchStatus } from './export-batch-entity';

@InjectInitializeDatabaseOnAllProps
export class ExportBatchRepository extends BaseRepository<ExportBatchEntity> {
    static repository: ExportBatchRepository = new ExportBatchRepository();
    static getRepository(): ExportBatchRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<ExportBatchRepository>(ExportBatchRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new ExportBatchRepository(ExportBatchEntity, manager);
            RequestContext.registerRepository(ExportBatchRepository.name, repository);
            return repository;
        }
        return ExportBatchRepository.repository;
    }
    constructor(target: EntityTarget<ExportBatchEntity> = ExportBatchEntity, manager?: EntityManager) {
        super(target, manager);
    }
    getLatestBatch() {
        return this.findOne({
            order: {
                createdAt: 'DESC',
            },
        });
    }
    getPending() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return this.find({
            take: 30,
            order: {
                createdAt: 'asc',
            },
            where: [
                {
                    status: ExportBatchStatus.PENDING,
                },
                {
                    // status is failed, we should retry
                    status: ExportBatchStatus.FAILED,
                },
                {
                    // if the last completed at is more than 30 days ago, we should retry
                    lastCompletedAt: LessThanOrEqual(thirtyDaysAgo),
                    status: ExportBatchStatus.COMPLETED,
                },
            ],
        });
    }
}
