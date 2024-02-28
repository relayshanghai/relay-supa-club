import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ProductEntity } from './product-entity';
import { Like, type FindManyOptions } from 'typeorm';
import type { Paginated, PaginationParam } from 'types/pagination';

@InjectInitializeDatabaseOnAllProps
export default class ProductRepository extends BaseRepository<ProductEntity> {
    static repository: ProductRepository = new ProductRepository();
    static getRepository(): ProductRepository {
        return this.repository;
    }
    constructor() {
        super(ProductEntity);
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
