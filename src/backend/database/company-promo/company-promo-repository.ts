import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import type { EntityManager, EntityTarget } from 'typeorm';
import { RequestContext } from 'src/utils/request-context/request-context';
import { CompanyPromoEntity, type CompanyPromos } from './company-promo-entity';

@InjectInitializeDatabaseOnAllProps
export default class CompanyPromoRepository extends BaseRepository<CompanyPromoEntity> {
    static repository = new CompanyPromoRepository();
    static getRepository(): CompanyPromoRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<CompanyPromoRepository>(CompanyPromoRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new CompanyPromoRepository(CompanyPromoEntity, manager);
            RequestContext.registerRepository(CompanyPromoRepository.name, repository);
            return repository;
        }
        return CompanyPromoRepository.repository;
    }
    constructor(target: EntityTarget<CompanyPromoEntity> = CompanyPromoEntity, manager?: EntityManager) {
        super(target, manager);
    }
    async getCompanyPromoByCompanyId(companyId: string, promoCode: CompanyPromos): Promise<CompanyPromoEntity | null> {
        return this.findOne({
            where: {
                company: {
                    id: companyId,
                },
                promo: promoCode,
            },
        });
    }
    async addCompanyPromo(companyId: string, promoCode: CompanyPromos): Promise<CompanyPromoEntity> {
        return this.save({
            company: {
                id: companyId,
            },
            promo: promoCode,
        });
    }
}
