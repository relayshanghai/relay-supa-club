import type {
    AccountRole,
    CreatorPlatform,
    DatabaseWithCustomTypes,
    InfluencerOutreachStatus,
    SequenceEmailStep,
    SubscriptionPlans,
    SubscriptionStatus,
    UsageType,
} from 'types';
import type { Database } from 'types/supabase';
import type { SupabaseLogType } from './calls/';
import type { SupabaseClient } from '@supabase/supabase-js';

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
        subscription_plan?: SubscriptionPlans;
    };
    Insert: Database['public']['Tables']['companies']['Insert'] & {
        subscription_status?: SubscriptionStatus;
        subscription_plan?: SubscriptionPlans;
    };
    Update: Database['public']['Tables']['companies']['Update'] & {
        subscription_status?: SubscriptionStatus;
        subscription_plan?: SubscriptionPlans;
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
        platform?: CreatorPlatform;
        status?: InfluencerOutreachStatus;
    };
};

export type CampaignCreatorDB = CampaignCreatorsTable['Row'];
export type CampaignCreatorDBInsert = CampaignCreatorsTable['Insert'];
export type CampaignCreatorDBUpdate = CampaignCreatorsTable['Update'];

export type Sequence = Database['public']['Tables']['sequences']['Row'];
export type SequenceInsert = Database['public']['Tables']['sequences']['Insert'];
export type SequenceUpdate = Database['public']['Tables']['sequences']['Update'];

export type TemplateVariablesTable = Database['public']['Tables']['template_variables'];
export type TemplateVariable = TemplateVariablesTable['Row'] & {
    /** The key to send to Email Engine in `SendEmailRequestBody.render.params`. Must match what is set in the Email Engine template. */
    key: string;
};
export type TemplateVariableInsert = TemplateVariablesTable['Insert'] & {
    /** The key to send to Email Engine in `SendEmailRequestBody.render.params`. Must match what is set in the Email Engine template. */
    key: string;
};
export type TemplateVariableUpdate = TemplateVariablesTable['Update'] & {
    /** The key to send to Email Engine in `SendEmailRequestBody.render.params`. Must match what is set in the Email Engine template. */
    key?: string;
};

type SequenceStepDetailedTypes = {
    /** Int, first step = 0 */
    step_number: number;
    name: SequenceEmailStep;
};

export type SequenceStepsTable = Database['public']['Tables']['sequence_steps'] & {
    Row: Database['public']['Tables']['sequence_steps']['Row'] & SequenceStepDetailedTypes;
    Insert: Database['public']['Tables']['sequence_steps']['Insert'] & SequenceStepDetailedTypes;
    Update: Database['public']['Tables']['sequence_steps']['Update'] & SequenceStepDetailedTypes;
};

export type SequenceStep = SequenceStepsTable['Row'];
export type SequenceStepInsert = SequenceStepsTable['Insert'];
export type SequenceStepUpdate = SequenceStepsTable['Update'];

export type EmailDeliveryStatus = 'Scheduled' | 'Delivered' | 'Replied' | 'Bounced' | 'Failed';
export type EmailTrackingStatus = 'Opened' | 'Link Clicked';

export type SequenceEmailsTable = Database['public']['Tables']['sequence_emails'] & {
    Row: Database['public']['Tables']['sequence_emails']['Row'] & {
        email_delivery_status: EmailDeliveryStatus | null;
        email_tracking_status: EmailTrackingStatus | null;
    };
    Insert: Database['public']['Tables']['sequence_emails']['Insert'] & {
        email_delivery_status?: EmailDeliveryStatus;
        email_tracking_status?: EmailTrackingStatus;
    };
    Update: Database['public']['Tables']['sequence_emails']['Update'] & {
        email_delivery_status?: EmailDeliveryStatus;
        email_tracking_status?: EmailTrackingStatus;
    };
};

export type SequenceEmail = SequenceEmailsTable['Row'];
export type SequenceEmailInsert = SequenceEmailsTable['Insert'];
export type SequenceEmailUpdate = SequenceEmailsTable['Update'];

/** Ignored means it has gone through the whole sequence with no reply (+ 7 days) */
export type FunnelStatus =
    | 'To Contact'
    | 'In Sequence'
    | 'Ignored'
    | 'Negotiating'
    | 'Confirmed'
    | 'Shipped'
    | 'Rejected'
    | 'Received'
    | 'Content Approval'
    | 'Posted';

type SequenceInfluencerDetailedTypes = {
    /** 0 means either not sent or first step (outreach) sent. 1 means Follow-up 1 was sent. */
    sequence_step?: number;
    funnel_status?: FunnelStatus;
    platform?: CreatorPlatform;
};

export type SequenceInfluencersTable = Database['public']['Tables']['sequence_influencers'] & {
    Row: Database['public']['Tables']['sequence_influencers']['Row'] & SequenceInfluencerDetailedTypes;
    Insert: Database['public']['Tables']['sequence_influencers']['Insert'] & SequenceInfluencerDetailedTypes;
    Update: Database['public']['Tables']['sequence_influencers']['Update'] & SequenceInfluencerDetailedTypes;
};

export type SequenceInfluencer = SequenceInfluencersTable['Row'];
type SequenceInfluencerInsertRequiredFields = {
    name: string;
    username: string;
    avatar_url: string;
    url: string;
    platform: CreatorPlatform;
};
export type SequenceInfluencerInsert = SequenceInfluencersTable['Insert'] & SequenceInfluencerInsertRequiredFields;
export type SequenceInfluencerUpdate = SequenceInfluencersTable['Update'];

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

export type InfluencerInsert = Database['public']['Tables']['influencers']['Insert'];
export type InfluencerRow = Database['public']['Tables']['influencers']['Row'];

export type InfluencerSocialProfileInsert = Database['public']['Tables']['influencer_social_profiles']['Insert'];
export type InfluencerSocialProfileRow = Database['public']['Tables']['influencer_social_profiles']['Row'];

export type InfluencerSocialProfileReferenceId = string;

export type InfluencerSocialProfilesTable = Database['public']['Tables']['influencer_social_profiles'] & {
    Row: Database['public']['Tables']['influencer_social_profiles']['Row'] & {
        /**
         * Identifier from the data source
         *
         *  Example: `datasource:123abc`
         *
         *  Take note that this is the ID in that datasource not the platform (iqdata uses the platform's id)
         *  We can use this to "refer" to the social profile in that datasource
         */
        reference_id: InfluencerSocialProfileReferenceId;
    };
};

/**
 * Supabase client instance with custom database
 */
export type RelayDatabase = SupabaseClient<DatabaseWithCustomTypes>;

export type TrackingEvents = Database['public']['Tables']['tracking_events'];
export type SearchSnapshots = Database['public']['Tables']['search_snapshots'];
export type ReportSnapshots = Database['public']['Tables']['report_snapshots'];
export type SearchParameters = Database['public']['Tables']['search_parameters'];
export type VercelLogs = Database['public']['Tables']['vercel_logs'];
export type CampaignNotes = Database['public']['Tables']['campaign_notes'];
export type InfluencerPosts = Database['public']['Tables']['influencer_posts'];
export type Addresses = Database['public']['Tables']['addresses'];
