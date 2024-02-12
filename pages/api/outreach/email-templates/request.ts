import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum OutreachStepRequest {
    OUTREACH = 'OUTREACH',
    FIRST_FOLLOW_UP = 'FIRST_FOLLOW_UP',
    SECOND_FOLLOW_UP = 'SECOND_FOLLOW_UP',
    THIRD_FOLLOW_UP = 'THIRD_FOLLOW_UP',
}

export class TemplateRequest {
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsString()
    subject!: string;

    @IsString()
    template!: string;

    @IsEnum(OutreachStepRequest)
    step!: OutreachStepRequest;

    @IsString({
        each: true,
    })
    @IsArray()
    variableIds: string[] = [];
}

export class GetTemplateRequest {
    @IsEnum(OutreachStepRequest)
    @IsOptional()
    step!: OutreachStepRequest;
}
