import awaitToError from 'src/utils/await-to-error';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { CompanyEntity } from './company-entity';
import { NotFoundError } from 'src/utils/error/http-error';
import { RequestContext } from 'src/utils/request-context/request-context';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class CompanyRepository extends BaseRepository<CompanyEntity> {
    static repository: CompanyRepository = new CompanyRepository();

    static getRepository(): CompanyRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<CompanyRepository>(CompanyRepository.name);
            if (contextRepository) {
                return contextRepository as CompanyRepository;
            }
            const repository = new CompanyRepository(CompanyEntity, manager);
            RequestContext.registerRepository(CompanyRepository.name, repository);
            return repository;
        }
        return CompanyRepository.repository;
    }
    constructor(target: EntityTarget<CompanyEntity> = CompanyEntity, manager?: EntityManager) {
        super(target, manager);
    }
    async getCompanyByName(name: string) {
        const [err, company] = await awaitToError(
            this.findOneByOrFail({
                name,
            }),
        );
        if (err) {
            throw new NotFoundError('Company not found', err);
        }
        return company;
    }
}
