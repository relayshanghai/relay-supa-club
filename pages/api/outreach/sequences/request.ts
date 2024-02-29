import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class SequenceTemplate {
    id!: string;
}

export class Variable {
    name!: string;
    value!: string;
}

export class SequenceRequest {
    @IsString()
    name!: string;

    @IsString()
    @IsOptional()
    productId?: string;

    @IsArray()
    sequenceTemplates?: SequenceTemplate[];

    @IsArray()
    variables?: Variable[];

    @IsOptional()
    @IsBoolean()
    autoStart?: boolean;
}
