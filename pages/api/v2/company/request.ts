import { IsEnum, IsString } from 'class-validator';

export class DeleteTeammateRequest {
    @IsString()
    adminId!: string;
    @IsString()
    teammateId!: string;
}

export class UpdateTeammateRoleRequest {
    @IsString()
    adminId!: string;
    @IsString()
    teammateId!: string;
    @IsEnum(['company_owner', 'company_teammate'])
    role!: 'company_owner' | 'company_teammate';
}
