import { IsArray, IsOptional, IsString } from "class-validator";

export class EmailContactRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    address!: string;
}

export class ReplyRequest {
    @IsString()
    content!: string;
    @IsArray()
    cc!: EmailContactRequest[];
    @IsArray()
    to!: EmailContactRequest[];
}