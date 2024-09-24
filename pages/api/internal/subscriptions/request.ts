import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SubscriptionMigrationRequest {
    @IsBoolean()
    @IsOptional()
    isDryRun?: boolean;

    @IsString()
    @IsOptional()
    customerIds?: string[];

    @IsString({
        each: true,
    })
    sourcePriceIds!: string[];

    @IsString()
    targetPriceId!: string;
}
