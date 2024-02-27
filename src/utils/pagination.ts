import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class PaginationParam {
    @IsOptional()
    @IsNumberString()
    page = 1;

    @IsOptional()
    @IsNumber()
    size!: number;
}

export interface Paginated<T> {
    items: T[];
    page: number;
    total_pages: number;
}
