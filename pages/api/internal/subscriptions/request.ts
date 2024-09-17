import { IsString } from 'class-validator';

export class SubscriptionMigrationRequest {
    @IsString()
    customerIds!: string[];

    @IsString()
    targetPriceId!: string;
}
