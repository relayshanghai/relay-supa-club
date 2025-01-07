import type { BillingPeriod, Currency, PriceType } from 'src/backend/database/plan/plan-entity';

export interface PlanDetail {
    currency: Currency;
    price: number;
    priceId: string;
    originalPrice?: number | null;
    originalPriceId?: string | null;
    existingUserPrice?: number | null;
    existingUserPriceId?: string | null;
    isActive: boolean;
    id: string;
}

export interface PlanSummary {
    itemName: string;
    priceType: PriceType;
    billingPeriod: BillingPeriod;
    profiles: number;
    searches: number;
    exports: number;
    details: PlanDetail[];
}
