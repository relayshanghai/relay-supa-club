import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import type { ProductEntity } from 'src/backend/database/product/product-entity';

export class SequenceTemplate {
    @IsString()
    id!: string;
}

export class Variable {
    @IsString()
    name!: string;

    @IsString()
    value!: string;
}

export class SequenceRequest {
    @IsString()
    name!: string;

    @IsString()
    @IsOptional()
    productId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SequenceTemplate)
    sequenceTemplates?: SequenceTemplate[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Variable)
    variables?: Variable[];

    @IsOptional()
    @IsBoolean()
    autoStart?: boolean;
}

export class GetSequenceRequest {
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page = 1;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    size = 10;

    @IsOptional()
    @IsString()
    name?: string = '';
}

export class GetSequenceResponse {
    @IsNumber()
    page!: number;
    @IsNumber()
    size!: number;
    @IsNumber()
    totalItems!: number;
    @IsArray()
    items!: {
        id: string;
        name: string;
        product: ProductEntity;
        autoStart: boolean;
        totalInfluencers: number;
    }[];
}
