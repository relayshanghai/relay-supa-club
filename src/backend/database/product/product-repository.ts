import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ProductEntity } from './product-entity';
import { Like, type FindManyOptions, type EntityTarget, type EntityManager } from 'typeorm';
import type { Paginated, PaginationParam } from 'types/pagination';

@InjectInitializeDatabaseOnAllProps
export default class ProductRepository extends BaseRepository<ProductEntity> {
    static repository: ProductRepository = new ProductRepository();
    static getRepository(): ProductRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<ProductRepository>(ProductRepository.name);
            if (contextRepository) {
                return contextRepository as ProductRepository;
            }
            const repository = new ProductRepository(ProductEntity, manager);
            RequestContext.registerRepository(ProductRepository.name, repository);
            return repository;
        }
        return ProductRepository.repository;
    }
    constructor(target: EntityTarget<ProductEntity> = ProductEntity, manager?: EntityManager) {
        super(target, manager);
    }

    override async getPaginated(
        { page, size }: PaginationParam,
        options: FindManyOptions<ProductEntity> = {},
        { name }: Partial<ProductEntity> = {},
    ): Promise<Paginated<ProductEntity>> {
        options.where = {
            ...options.where,
            name: name && Like(`%${name}%`),
        };
        const paginatedItems = await super.getPaginated({ page, size }, options);
        const items = paginatedItems.items.map((d) => ({
            id: d.id,
            name: d.name ?? '',
            description: d.description ?? '',
            price: d.price ?? 0,
            shopUrl: d.shopUrl ?? '',
            currency: d.priceCurrency ?? '',
            createdAt: new Date(d.createdAt),
            updatedAt: new Date(d.updatedAt),
        }));
        paginatedItems.items = items;
        return paginatedItems;
    }
}
