import { IsNumber } from 'class-validator';

export default class PaginationParam {
    @IsNumber()
    page!: number;

    @IsNumber()
    size!: number;
}
