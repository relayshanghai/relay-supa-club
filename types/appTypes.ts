import { z } from 'zod';

import type {
    CampaignCreatorsTable,
    CompanyTable,
    InfluencerSocialProfilesTable,
    ProfilesTable,
    UsagesTable,
} from 'src/utils/api/db';
import type Stripe from 'stripe';
import type { Database } from './supabase';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = {
    id: string;
    weight: number;
    name: string;
    type: string[];
    title: string;
    country: {
        id: string;
        code: string;
    };
};
export type CreatorSearchTag = { tag: string; value: string };

export type SubscriptionPeriod = 'monthly' | 'quarterly' | 'annually';
export type SubscriptionTier = 'diy' | 'diyMax' | 'VIP';
export type RelayPlan = {
    currency: string;
    prices: {
        monthly: string;
        quarterly: string;
        annually: string;
    };
    profiles: string;
    searches: string;
    priceIds: {
        monthly: string;
        quarterly: string;
        annually: string;
    };
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

    // Only for DIY plan:
    /** How many days is the trial period (stringified number) */
    trial_days?: string;
    /** How many searches are allowed during the trial period (stringified number) */
    trial_searches?: string;
    /** How many profiles are allowed during the trial period (stringified number) */
    trial_profiles?: string;
    /** How many AI email generations are allowed in trial  period (stringified number)   */
    trial_ai_emails?: string;
    /** How many AI email generations are allowed pre month (stringified number)   */
    ai_emails?: string;
};
export interface StripePriceWithProductMetadata extends Stripe.Price {
    product: RelayPlanStripeProduct;
}

export type SubscriptionStatus = 'awaiting_payment_method' | 'trial' | 'active' | 'canceled';
/** "profile" for creator report, "search" for creator search, "ai_email" for usage of the ai email generator */
export type UsageType = 'profile' | 'search' | 'ai_email';

export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';
export type SocialMediaPlatform = CreatorPlatform | 'email' | 'twitter' | 'facebook' | 'wechat';

export type InfluencerOutreachStatus =
    | 'to contact'
    | 'contacted'
    | 'in progress'
    | 'confirmed'
    | 'posted'
    | 'rejected'
    | 'ignored';

/**
 * relay expert is a relay employee assigned to the company to act on their behalf. Their usages are counted against the company's usages.
 * relay_employee is an admin super user who can see all of the campaigns and companies.
 */
export type AccountRole = 'company_owner' | 'company_teammate' | 'relay_expert' | 'relay_employee';

export interface DatabaseWithCustomTypes extends Database {
    public: Database['public'] & {
        Tables: Database['public']['Tables'] & {
            companies: CompanyTable;
            usages: UsagesTable;
            campaign_creators: CampaignCreatorsTable;
            profiles: ProfilesTable;
            influencer_social_profiles: InfluencerSocialProfilesTable;
        };
    };
}

export const CompanySize = z.union([z.literal('small'), z.literal('medium'), z.literal('large')]);
export type CompanySize = z.infer<typeof CompanySize>;
