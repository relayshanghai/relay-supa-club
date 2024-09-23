import { IsString } from 'class-validator';

export class SubscriptionMigrationRequest {
    @IsString()
    customerIds?: string[];

    @IsString()
    sourcePriceId!: string;

    @IsString()
    targetPriceId!: string;
}
