import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import type { BillingPeriod, Currency, PriceType } from 'src/backend/database/plan/plan-entity';

export class GetPlansQuery {
    @IsOptional()
    type?: 'top-up' | 'subscription' | 'all';

    @IsOptional()
    summarized?: boolean;
}
export class CreatePlanRequest {
    @IsString()
    itemName!: string;

    @IsString()
    priceType!: PriceType;

    @IsString()
    currency!: Currency;

    @IsString()
    billingPeriod!: BillingPeriod;

    @IsNumber()
    price!: number;

    @IsNumber()
    @IsOptional()
    originalPrice?: number;

    @IsNumber()
    @IsOptional()
    existingUserPrice?: number;

    @IsString()
    priceId!: string;

    @IsString()
    @IsOptional()
    originalPriceId?: string;

    @IsString()
    @IsOptional()
    existingUserPriceId?: string;

    @IsNumber()
    profiles!: number;

    @IsNumber()
    searches!: number;

    @IsNumber()
    exports!: number;

    @IsBoolean()
    isActive!: boolean;
}
