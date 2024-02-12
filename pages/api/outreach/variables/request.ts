import { IsString } from "class-validator";

export class TemplateVariableRequest {
    @IsString()
    name!: string;

    @IsString()
    category!: string;
}