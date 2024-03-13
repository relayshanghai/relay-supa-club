import { IsNumberString } from 'class-validator';

export class PaginationParam {
    @IsNumberString()
    page!: number;

    @IsNumberString()
    size!: number;
}

export interface Paginated<T> {
    items: T[];
    totalSize: number;
    totalPages: number;
    page: number;
    size: number;
}
