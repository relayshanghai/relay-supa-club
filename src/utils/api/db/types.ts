import type { CreatorPlatform, SubscriptionStatus, UsageType } from 'types';
import type { Database } from 'types/supabase';

export type ProfileDB = Database['public']['Tables']['profiles']['Row'];
export type ProfileDBUpdate = Database['public']['Tables']['profiles']['Update'];
export type ProfileInsertDB = Database['public']['Tables']['profiles']['Insert'];

export type CompanyTable = Database['public']['Tables']['companies'] & {
    Row: Database['public']['Tables']['companies']['Row'] & {
        subscription_status: SubscriptionStatus;
    };
    Insert: Database['public']['Tables']['companies']['Insert'] & {
        subscription_status?: SubscriptionStatus;
    };
    Update: Database['public']['Tables']['companies']['Update'] & {
        subscription_status?: SubscriptionStatus;
    };
};

export type CompanyDB = CompanyTable['Row'];
export type CompanyDBUpdate = CompanyTable['Update'];
export type CompanyDBInsert = CompanyTable['Insert'];

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
export type CampaignDBUpdate = Database['public']['Tables']['campaigns']['Update'];
export type CampaignDBInsert = Database['public']['Tables']['campaigns']['Insert'];

export type CampaignCreatorsTable = Database['public']['Tables']['campaign_creators'] & {
    Row: Database['public']['Tables']['campaign_creators']['Row'] & {
        platform: CreatorPlatform;
    };
    Insert: Database['public']['Tables']['campaign_creators']['Insert'] & {
        platform: CreatorPlatform;
    };
    Update: Database['public']['Tables']['campaign_creators']['Update'] & {
        platform: CreatorPlatform;
    };
};

export type CampaignCreatorDB = CampaignCreatorsTable['Row'];
export type CampaignCreatorDBInsert = CampaignCreatorsTable['Insert'];
export type CampaignCreatorDBUpdate = CampaignCreatorsTable['Update'];

export type UsagesTable = Database['public']['Tables']['usages'] & {
    Row: Database['public']['Tables']['usages']['Row'] & {
        type: UsageType;
    };
    Insert: Database['public']['Tables']['usages']['Insert'] & {
        type: UsageType;
    };
    Update: Database['public']['Tables']['usages']['Update'] & {
        type?: UsageType;
    };
};

export type UsagesDB = UsagesTable['Row'];
export type UsagesDBInsert = UsagesTable['Insert'];

export type InvitesDB = Database['public']['Tables']['invites']['Row'];
