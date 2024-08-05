import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { type SocialMediaPlatform } from 'types';

export class AddInfluencerRequest {
    @IsString()
    @IsOptional()
    avatarUrl!: string;

    @IsString()
    iqdataId!: string;

    @IsString()
    @IsOptional()
    name!: string;

    @IsString()
    platform!: SocialMediaPlatform;

    @IsNumber()
    @IsOptional()
    rateAmount!: number;

    @IsString()
    @IsOptional()
    rateCurrency!: string;

    @IsNumber()
    @IsOptional()
    sequenceStep!: number;

    @IsString()
    @IsOptional()
    url!: string;

    @IsString()
    @IsOptional()
    username!: string;
}

export class AddMultipleInfluencerRequest {
    @IsArray()
    influencers!: AddInfluencerRequest[];
}
