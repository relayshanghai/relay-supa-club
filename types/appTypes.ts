import { z } from 'zod';

import type {
    CampaignCreatorsTable,
    CompanyTable,
    InfluencerSocialProfilesTable,
    ProfilesTable,
    SequenceEmailsTable,
    SequenceInfluencersTable,
    SequenceStepsTable,
    UsagesTable,
} from 'src/utils/api/db';
import type Stripe from 'stripe';
import type { Database } from './supabase';
import type { audience_age_range, audience_gender } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { Nullable } from './nullable';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = {
    id: number;
    weight: number;
    name: string;
    type: string[];
    title: string;
    country: {
        id: number;
        code: string;
    };
};
export type AudienceAgeRangeWeighted = z.input<typeof audience_age_range> | undefined;
export type AudienceGenderWeighted = z.input<typeof audience_gender> | undefined;
export type CreatorSearchTag = { tag: string; value: string };

export type SubscriptionPeriod = 'monthly' | 'quarterly' | 'annually';
export type SubscriptionTier = 'diy' | 'diyMax' | 'VIP' | 'discovery' | 'outreach' | 'addPayment';
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

export type NewRelayPlan = {
    currency: string;
    prices: {
        monthly: string;
        annually: string;
    };
    profiles: string;
    searches: string;
    priceIds: {
        monthly: string;
        annually: string;
    };
};

export type RelayPlanWithAnnual = {
    currency: string;
    prices: {
        monthly: string;
        annually: string;
    };
    originalPrices: {
        monthly: Nullable<string>;
        annually: Nullable<string>;
    };
    profiles: string;
    searches: string;
    priceIds: {
        monthly: string;
        annually: string;
    };
    priceIdsForExistingUser?: {
        monthly: string;
        annually: string;
    };
    forExistingUser?: {
        monthly: string;
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
    /** (Deprecated) How many AI email generations are allowed in trial  period (stringified number)   */
    trial_ai_emails?: string;
    /** (Deprecated) How many AI email generations are allowed pre month (stringified number)   */
    ai_emails?: string;
};
export interface StripePriceWithProductMetadata extends Stripe.Price {
    product: RelayPlanStripeProduct;
}

export type SubscriptionStatus = 'awaiting_payment_method' | 'trial' | 'active' | 'canceled' | 'paused';
//the subscription plan are from Stripe Product, some of the old plans should be archived when all user data is migrated to the new plans
export type SubscriptionPlans =
    | 'Discovery'
    | 'Outreach'
    | 'Company Demo'
    | 'DIY'
    | 'DIY Max'
    | 'VIP'
    | 'Discovery(deprecated)';
/** "profile" for creator report, "search" for creator search, "ai_email" (Deprecated)  for usage of the ai email generator */
export type UsageType = 'profile' | 'search';

export const CREATOR_PLATFORM_OPTIONS = ['instagram', 'youtube', 'tiktok'] as const;

export const CreatorPlatform = z.enum(CREATOR_PLATFORM_OPTIONS);
export type CreatorPlatform = z.infer<typeof CreatorPlatform>;
export type SocialMediaPlatform = CreatorPlatform | 'email' | 'twitter' | 'facebook' | 'wechat';
export const influencerSizes = ['microinfluencer', 'nicheinfluencer', 'megainfluencer'] as const;
export type InfluencerSize = (typeof influencerSizes)[number];

export type InfluencerOutreachStatus =
    | 'to contact'
    | 'contacted'
    | 'in progress'
    | 'confirmed'
    | 'posted'
    | 'rejected'
    | 'ignored';

export type SequenceEmailStep = 'Outreach' | '1st Follow-up' | '2nd Follow-up';

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
            sequence_steps: SequenceStepsTable;
            sequence_influencers: SequenceInfluencersTable;
            sequence_emails: SequenceEmailsTable;
        };
    };
}

export const CompanySize = z.union([z.literal('small'), z.literal('medium'), z.literal('large'), z.null()]);
export type CompanySize = z.infer<typeof CompanySize>;

/**
 * Contains an object that holds the event_id and snapshot_id
 *
 *  This serves as a workaround for the cached search results
 *  by passing around ids between the frontend and backend
 */
export type SearchResultMetadata = {
    __metadata?: {
        event_id: string;
        snapshot_id: string;
        parameters_id: string;
    };
};

export type ParamType = { [key: string]: number | number[] | string | string[] | undefined };
export interface PageParams {
    params?: ParamType;
    searchParams?: ParamType;
}
