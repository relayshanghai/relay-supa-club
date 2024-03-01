import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

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
    variables?: Variable[];

    @IsOptional()
    @IsBoolean()
    autoStart?: boolean;
}
