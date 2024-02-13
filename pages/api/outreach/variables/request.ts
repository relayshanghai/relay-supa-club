import { IsString, Matches } from 'class-validator';

export class TemplateVariableRequest {
    @IsString()
    @Matches(/^[A-Za-z_\.]*$/, {
        message: 'Name should contain only letters and underscores',
    })
    name!: string;

    @IsString()
    category!: string;
}
