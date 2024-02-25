import type { Knex } from 'knex';
import { knex } from 'knex';
import { HttpError } from 'src/utils/error/http-error';
import type { Paginated, PaginationParam } from 'types/pagination';
export const DEFAULT_FETCH_SIZE = 25;
export interface MappingFn<T> {
    (row: any): Promise<T>;
}
export interface PaginateOptions {
    clearOrder?: boolean;
    clearSelect?: boolean;
}
export default class BaseRepository<T> {
    static connection: Knex;
    protected keyField: string;

    constructor(protected table: string) {
        this.keyField = `${table}.id`;
        if (!BaseRepository.connection) {
            const connectionUrl = process.env.SUPABASE_CONNECTION_URL;
            BaseRepository.connection = knex({
                client: 'postgres',
                connection: connectionUrl,
                searchPath: ['public'],
                pool: {
                    max: 1,
                    min: 0,
                },
            });
        }
    }

    getConnection() {
        return BaseRepository.connection;
    }

    /**
     *
     * @param query instance of knex query
     * @param param pagination parameters { page, size } @see {PaginationParam}
     * @param mappingFn optional, mapping function for each row, used for remapping for each row object
     * @param clearOrder optional, for clearing order and group in statement
     * @returns
     */
    async paginate(
        query: Knex.QueryBuilder,
        param: PaginationParam,
        mappingFn?: MappingFn<T>,
        options?: PaginateOptions,
    ): Promise<Paginated<T>> {
        const { clearOrder = false, clearSelect = true } = options || {};
        const { page = 1, size = DEFAULT_FETCH_SIZE } = param;
        let totalElements;

        const clearedQuery = query.clone();

        if (clearOrder) {
            clearedQuery.clearOrder().clearGroup();
        }
        if (clearSelect) {
            [{ totalElements }] = await clearedQuery
                .clearSelect()
                .count<Record<string, number>[]>(`${this.keyField} as totalElements`);
        } else {
            // Queries total elements by wrapping select count(*) around original query
            const countAllQuery = this.getConnection()
                .count<[{ totalElements: number }]>(`* as totalElements`)
                .from(clearedQuery.as('main'));
            [{ totalElements }] = await countAllQuery;
        }
        // Return empty result if there are zero totalElements
        if (totalElements === 0) {
            return {
                page,
                size,
                totalElements,
                totalPages: 1,
                items: [],
            };
        }

        let totalPages = Math.ceil(totalElements / size);
        if (totalPages == 0) {
            totalPages = 1;
        }
        let items: T[] = await query.limit(size).offset((page - 1) * size);
        if (mappingFn) {
            items = await Promise.all(items.map((row: T) => Promise.resolve(mappingFn(row))));
        }
        return {
            items,
            page,
            size: size,
            totalPages: totalPages,
            totalElements,
        };
    }

    async exists(...ids: number[] | string[]) {
        return this.existAndFilter(undefined, ...ids);
    }

    async existAndFilter(filters: Record<string, string | boolean | number> = {}, ...ids: number[] | string[]) {
        const query = this.getConnection().select<Record<string, number>[]>(`${this.keyField}`);
        if (filters && Object.keys(filters).length > 0) {
            query.where(filters);
        }
        query.whereIn(`${this.keyField}`, ids);
        const rows = await query;
        const idsDoesntExists: (string | number)[] = [];
        ids.forEach((id) => {
            const find = rows.find((row) => row.id === id);
            if (!find) idsDoesntExists.push(id);
        });
        if (idsDoesntExists.length > 0) {
            throw new HttpError(`${this.table} with id '${idsDoesntExists}' does not exist`, 404);
        }
    }
}
