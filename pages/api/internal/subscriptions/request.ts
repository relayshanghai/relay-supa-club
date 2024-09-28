import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TargetPriceIds {
    @IsString()
    usdPriceId!: string;

    @IsString()
    cnyPriceId!: string;
}

export class SubscriptionMigrationRequest {
    @IsBoolean()
    @IsOptional()
    isDryRun?: boolean;

    @IsString()
    customerId!: string;

    @ValidateNested()
    targetPriceIds!: TargetPriceIds;
}

export class GetSubscriptionMigrationRequest {
    @IsOptional()
    @IsString()
    targetPriceId?: string;
}
