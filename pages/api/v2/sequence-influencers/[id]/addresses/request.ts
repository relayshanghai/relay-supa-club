import { IsOptional, IsString } from 'class-validator';

export class UpdateAddressRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    addressLine1?: string;

    @IsString()
    @IsOptional()
    addressLine2?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    postalCode?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    trackingCode?: string;
}
