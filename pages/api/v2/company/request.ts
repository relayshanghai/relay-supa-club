import { IsString } from 'class-validator';

export class DeleteTeammateRequest {
    @IsString()
    adminId!: string;
    @IsString()
    teammateId!: string;
}
