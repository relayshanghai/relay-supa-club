import awaitToError from 'src/utils/await-to-error';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { CompanyEntity } from './company-entity';
import { NotFoundError } from 'src/utils/error/http-error';

@InjectInitializeDatabaseOnAllProps
export default class CompanyRepository extends BaseRepository<CompanyEntity> {
    static repository: CompanyRepository = new CompanyRepository();
    static getRepository(): CompanyRepository {
        return this.repository;
    }
    constructor() {
        super(CompanyEntity);
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
