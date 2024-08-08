import type { EntityManager, EntityTarget, FindManyOptions, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';
import { DatabaseProvider } from './database-provider';
import type { Paginated, PaginationParam } from 'types/pagination';

export default class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    constructor(entity: EntityTarget<E>, manager?: EntityManager) {
        const baseRepository = DatabaseProvider.getDatasource().getRepository<E>(entity);
        super(baseRepository.target, manager || baseRepository.manager, baseRepository.queryRunner);
    }

    async getPaginated({ page, size }: PaginationParam, options: FindManyOptions<E> = {}): Promise<Paginated<E>> {
        page = parseInt(page.toString()) || 1;
        size = parseInt(size.toString()) || 10;
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
    async getPaginatedQb({ page, size }: PaginationParam, qb: SelectQueryBuilder<E>) {
        page = parseInt(page.toString()) || 1;
        size = parseInt(size.toString()) || 10;
        const [items, totalItems] = await qb
            .skip((page - 1) * size)
            .take(size)
            .getManyAndCount();
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
