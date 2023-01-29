import type { SubscriptionStatus } from 'types';
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

export type CampaignCreatorDB = Database['public']['Tables']['campaign_creators']['Row'];
export type CampaignCreatorDBInsert = Database['public']['Tables']['campaign_creators']['Insert'];
export type CampaignCreatorDBUpdate = Database['public']['Tables']['campaign_creators']['Update'];

export type UsagesDB = Database['public']['Tables']['usages']['Row'];
export type UsagesDBInsert = Database['public']['Tables']['usages']['Insert'];

export type InvitesDB = Database['public']['Tables']['invites']['Row'];
