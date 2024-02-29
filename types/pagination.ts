export interface PaginationParam {
    page: number;
    size: number;
}

export interface Paginated<T> {
    items: T[];
    totalSize: number;
    totalPages: number;
    page: number;
    size: number;
}
