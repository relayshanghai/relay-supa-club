import type Stripe from 'stripe';
import type { Database } from './supabase';

export type StripePlansWithPrice = Stripe.Product & { prices?: Stripe.Plan[] };
export type StripePaymentMethods = Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>;

export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';
export type SocialMediaPlatform = CreatorPlatform | 'email' | 'twitter' | 'facebook' | 'wechat';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = { id: string; weight: number };

export type ProfileDB = Database['public']['Tables']['profiles']['Row'];
export type CompanyDB = Database['public']['Tables']['companies']['Row'];
export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
export type CampaignCreatorDB = Database['public']['Tables']['campaign_creators']['Row'];
export type CampaignCreatorDBInsert = Database['public']['Tables']['campaign_creators']['Insert'];
export type UsagesDB = Database['public']['Tables']['usages']['Row'];
export type InvitesDB = Database['public']['Tables']['invites']['Row'];

// Custom type for supabase queries where we select more than one row in a single query
export type CompanyWithProfilesInvitesAndUsage = CompanyDB & {
    profiles: Pick<ProfileDB, 'id' | 'first_name' | 'last_name' | 'admin'>[];
    invites: Pick<InvitesDB, 'id' | 'email' | 'used'>[];
    usages: Pick<UsagesDB, 'id'>[];
};
export type CampaignWithCompanyCreators = CampaignDB & {
    companies: Pick<CompanyDB, 'id' | 'name' | 'cus_id'>;
    campaign_creators: Pick<
        CampaignCreatorDB,
        'id' | 'creator_id' | 'username' | 'fullname' | 'avatar_url' | 'link_url'
    >[];
};
