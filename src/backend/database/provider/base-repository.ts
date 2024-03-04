import type { EntityManager, EntityTarget, FindManyOptions, ObjectLiteral } from 'typeorm';
import { Repository } from 'typeorm';
import { DatabaseProvider } from './database-provider';
import type { Paginated, PaginationParam } from 'types/pagination';

export default class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    constructor(entity: EntityTarget<E>, manager?: EntityManager) {
        const baseRepository = DatabaseProvider.getDatasource().getRepository<E>(entity);
        super(baseRepository.target, manager || baseRepository.manager, baseRepository.queryRunner);
    }

    // generic fetch function with pagination page and size
    async getPaginated({ page, size }: PaginationParam, options: FindManyOptions<E> = {}): Promise<Paginated<E>> {
        page = page || 1;
        size = size || 10;
        const [items, totalItems] = await this.findAndCount({
            skip: (page - 1) * size,
            take: size,
            ...options,
        });
        const totalPages = Math.ceil(totalItems / size);
        const totalSize = totalItems;

        return {
            items,
            page,
            size,
            totalPages,
            totalSize,
        };
    }
}
