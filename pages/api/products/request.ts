import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProductRequest {
    @IsString()
    name!: string;

    @IsNumber()
    price!: number;

    @IsString()
    @IsOptional()
    description!: string;

    @IsString()
    @IsOptional()
    currency!: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    shopUrl!: string;
}
