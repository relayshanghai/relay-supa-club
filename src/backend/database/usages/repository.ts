import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { Between, type EntityManager, type EntityTarget } from 'typeorm';
import { RequestContext } from 'src/utils/request-context/request-context';
import { UsageEntity } from './entity';

@InjectInitializeDatabaseOnAllProps
export class UsageRepository extends BaseRepository<UsageEntity> {
    static repository: UsageRepository = new UsageRepository();
    static getRepository(): UsageRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<UsageRepository>(UsageRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new UsageRepository(UsageEntity, manager);
            RequestContext.registerRepository(UsageRepository.name, repository);
            return repository;
        }
        return UsageRepository.repository;
    }
    constructor(target: EntityTarget<UsageEntity> = UsageEntity, manager?: EntityManager) {
        super(target, manager);
    }

    async deleteUsagesByProfile(userId: string) {
        return this.delete({ profile: { id: userId } });
    }

    async getCountByCompany(companyId: string, startDate: Date, endDate: Date) {
        return this.count({
            where: {
                company: { id: companyId },
                createdAt: Between(startDate, endDate),
            },
        });
    }
    async getCountUsages(companyId: string, startPeriod: Date, endPeriod: Date) {
        const usages: { type: string; usage: number }[] = await this.query(
            `
            SELECT "type", count(*) as usage FROM usages
            where "company_id" = $1
            and "created_at" between $2 and $3
            GROUP BY "type"
            `,
            [companyId, startPeriod, endPeriod],
        );
        const result = usages.reduce((acc, cur) => {
            acc[cur.type] = cur.usage;
            return acc;
        }, {} as Record<string, number>);
        return {
            profile: result.profile || 0,
            search: result.search || 0,
            export: result.export || 0,
        };
    }
}
