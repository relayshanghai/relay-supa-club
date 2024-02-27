import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ProductEntity } from './product-entity';

@InjectInitializeDatabaseOnAllProps
export default class ProductRepository extends BaseRepository<ProductEntity> {
    static repository: ProductRepository = new ProductRepository();
    static getRepository(): ProductRepository {
        return this.repository;
    }
    constructor() {
        super(ProductEntity);
    }
}
