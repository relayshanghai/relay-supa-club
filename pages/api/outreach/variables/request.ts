import { IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class TemplateVariableRequest {
    @IsString()
    @Matches(/^[A-Za-z_]*$/, {
        message: 'Variable Name should contain only letters and underscores',
    })
    @Transform(({ value }) => value.trim())
    name!: string;

    @IsString()
    category!: string;
}
