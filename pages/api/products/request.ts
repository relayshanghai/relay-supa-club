import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProductRequest {
    @IsString()
    brandName!: string;

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

export class GetProductRequest {
    @IsOptional()
    @Type(() => Number)
    page!: number;

    @IsOptional()
    @Type(() => Number)
    size!: number;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    category?: string;
}
