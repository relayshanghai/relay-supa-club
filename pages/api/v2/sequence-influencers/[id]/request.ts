import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FunnelStatusRequest } from '../../threads/request';

export class UpdateSequenceInfluencerRequest {
    @IsOptional()
    @IsEnum(FunnelStatusRequest)
    funnelStatus?: FunnelStatusRequest;

    @IsOptional()
    @IsNumber()
    rateAmount?: number;

    @IsOptional()
    @IsNumber()
    commissionRate?: number;

    @IsOptional()
    @IsString()
    affiliateLink?: string;

    @IsOptional()
    @IsDateString()
    scheduledPostDate?: string;
}
