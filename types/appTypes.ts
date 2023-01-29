import type { CompanyTable } from 'src/utils/api/db';
import type Stripe from 'stripe';
import type { Database } from './supabase';

export type RelayPlan = {
    currency: string;
    prices: {
        monthly: string;
        quarterly: string;
        annually: string;
    };
    profiles: string;
    searches: string;
};

export interface RelayPlanStripeProduct extends Stripe.Product {
    metadata: RelayAccountPlanMetadata;
}

/** Make sure to enter this metadata correctly in the Stripe dashboard under product > additional options > metadata  */
export type RelayAccountPlanMetadata = {
    /** How many searches they can do per month (stringified number) */
    searches?: string;
    /** How many influencer profiles are they allowed to search for per month (stringified number) */
    profiles?: string;
};
export interface StripePriceWithProductMetadata extends Stripe.Price {
    product: RelayPlanStripeProduct;
}

export type SubscriptionStatus = 'awaiting_payment_method' | 'trial' | 'active';

export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';
export type SocialMediaPlatform = CreatorPlatform | 'email' | 'twitter' | 'facebook' | 'wechat';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = { id: string; weight: number };

export type CreatorSearchTag = { tag: string; value: string };

export interface DatabaseWithCustomTypes extends Database {
    public: Database['public'] & {
        Tables: Database['public']['Tables'] & {
            companies: CompanyTable;
        };
    };
}
