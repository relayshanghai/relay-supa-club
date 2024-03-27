import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetInfluencersRequest {
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page = 1;
    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit = 10;
}
