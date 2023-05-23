import type { AccountRole, CreatorPlatform, InfluencerOutreachStatus, SubscriptionStatus, UsageType } from 'types';
import type { Database } from 'types/supabase';
import type { SupabaseLogType } from './calls/';

export type ProfilesTable = Database['public']['Tables']['profiles'] & {
    Row: Database['public']['Tables']['profiles']['Row'] & {
        user_role?: AccountRole;
    };
    Insert: Database['public']['Tables']['profiles']['Insert'] & {
        user_role?: AccountRole;
    };
    Update: Database['public']['Tables']['profiles']['Update'] & {
        user_role?: AccountRole;
    };
};

export type ProfileDB = ProfilesTable['Row'];
export type ProfileDBUpdate = ProfilesTable['Update'];
export type ProfileDBInsert = ProfilesTable['Insert'];

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
export type CampaignDBUpdate = Exclude<Database['public']['Tables']['campaigns']['Update'], 'id'>;
export type CampaignDBInsert = Database['public']['Tables']['campaigns']['Insert'];

export type CampaignCreatorsTable = Database['public']['Tables']['campaign_creators'] & {
    Row: Database['public']['Tables']['campaign_creators']['Row'] & {
        platform: CreatorPlatform;
        status: InfluencerOutreachStatus;
    };
    Insert: Database['public']['Tables']['campaign_creators']['Insert'] & {
        platform: CreatorPlatform;
        status: InfluencerOutreachStatus;
    };
    Update: Database['public']['Tables']['campaign_creators']['Update'] & {
        platform: CreatorPlatform;
        status: InfluencerOutreachStatus;
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

export type CampaignNotesDB = Database['public']['Tables']['campaign_notes']['Row'];
export type CampaignNotesInsertDB = Database['public']['Tables']['campaign_notes']['Insert'];

export type LogsTable = Database['public']['Tables']['logs'] & {
    Row: Database['public']['Tables']['logs']['Row'] & {
        type: SupabaseLogType;
    };
    Insert: Database['public']['Tables']['logs']['Insert'] & {
        type: SupabaseLogType;
    };
    Update: Database['public']['Tables']['logs']['Update'] & {
        type?: SupabaseLogType;
    };
};
export type LogsDB = LogsTable['Row'];
export type LogsInsertDB = LogsTable['Insert'];

export type PostsPerformanceTable = Database['public']['Tables']['posts_performance'] & {
    Row: Database['public']['Tables']['posts_performance']['Row'];
    Insert: Database['public']['Tables']['posts_performance']['Insert'];
    Update: Database['public']['Tables']['posts_performance']['Update'];
};
export type PostsPerformance = PostsPerformanceTable['Row'];
export type PostsPerformanceInsert = PostsPerformanceTable['Insert'];
export type PostsPerformanceUpdate = PostsPerformanceTable['Update'];
