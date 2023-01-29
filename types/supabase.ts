export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    public: {
        Tables: {
            campaign_creators: {
                Row: {
                    added_by_id: number | null;
                    address: string | null;
                    avatar_url: string | null;
                    brief_opened_by_creator: boolean | null;
                    campaign_id: string | null;
                    created_at: string | null;
                    creator_id: string;
                    creator_model: string | null;
                    creator_token: string | null;
                    email_sent: boolean | null;
                    fullname: string | null;
                    id: string;
                    interested: boolean | null;
                    link_url: string | null;
                    need_support: boolean | null;
                    next_step: string | null;
                    paid_amount_cents: number;
                    paid_amount_currency: string;
                    payment_details: string | null;
                    payment_status: string;
                    platform: string;
                    publication_date: string | null;
                    rate_cents: number;
                    rate_currency: string;
                    reject_message: string | null;
                    relay_creator_id: number | null;
                    sample_status: string;
                    status: string | null;
                    tracking_details: string | null;
                    updated_at: string | null;
                    username: string | null;
                };
                Insert: {
                    added_by_id?: number | null;
                    address?: string | null;
                    avatar_url?: string | null;
                    brief_opened_by_creator?: boolean | null;
                    campaign_id?: string | null;
                    created_at?: string | null;
                    creator_id: string;
                    creator_model?: string | null;
                    creator_token?: string | null;
                    email_sent?: boolean | null;
                    fullname?: string | null;
                    id?: string;
                    interested?: boolean | null;
                    link_url?: string | null;
                    need_support?: boolean | null;
                    next_step?: string | null;
                    paid_amount_cents?: number;
                    paid_amount_currency?: string;
                    payment_details?: string | null;
                    payment_status?: string;
                    platform?: string;
                    publication_date?: string | null;
                    rate_cents?: number;
                    rate_currency?: string;
                    reject_message?: string | null;
                    relay_creator_id?: number | null;
                    sample_status?: string;
                    status?: string | null;
                    tracking_details?: string | null;
                    updated_at?: string | null;
                    username?: string | null;
                };
                Update: {
                    added_by_id?: number | null;
                    address?: string | null;
                    avatar_url?: string | null;
                    brief_opened_by_creator?: boolean | null;
                    campaign_id?: string | null;
                    created_at?: string | null;
                    creator_id?: string;
                    creator_model?: string | null;
                    creator_token?: string | null;
                    email_sent?: boolean | null;
                    fullname?: string | null;
                    id?: string;
                    interested?: boolean | null;
                    link_url?: string | null;
                    need_support?: boolean | null;
                    next_step?: string | null;
                    paid_amount_cents?: number;
                    paid_amount_currency?: string;
                    payment_details?: string | null;
                    payment_status?: string;
                    platform?: string;
                    publication_date?: string | null;
                    rate_cents?: number;
                    rate_currency?: string;
                    reject_message?: string | null;
                    relay_creator_id?: number | null;
                    sample_status?: string;
                    status?: string | null;
                    tracking_details?: string | null;
                    updated_at?: string | null;
                    username?: string | null;
                };
            };
            campaigns: {
                Row: {
                    budget_cents: number | null;
                    budget_currency: string | null;
                    company_id: string;
                    created_at: string | null;
                    creator_count: number | null;
                    date_end_campaign: string | null;
                    date_end_creator_outreach: string | null;
                    date_start_campaign: string | null;
                    description: string;
                    id: string;
                    media: Json[] | null;
                    media_path: string[] | null;
                    name: string;
                    product_link: string | null;
                    product_name: string | null;
                    promo_types: string[] | null;
                    purge_media: Json[] | null;
                    requirements: string | null;
                    slug: string | null;
                    status: string | null;
                    tag_list: string[] | null;
                    target_locations: string[] | null;
                };
                Insert: {
                    budget_cents?: number | null;
                    budget_currency?: string | null;
                    company_id: string;
                    created_at?: string | null;
                    creator_count?: number | null;
                    date_end_campaign?: string | null;
                    date_end_creator_outreach?: string | null;
                    date_start_campaign?: string | null;
                    description: string;
                    id?: string;
                    media?: Json[] | null;
                    media_path?: string[] | null;
                    name: string;
                    product_link?: string | null;
                    product_name?: string | null;
                    promo_types?: string[] | null;
                    purge_media?: Json[] | null;
                    requirements?: string | null;
                    slug?: string | null;
                    status?: string | null;
                    tag_list?: string[] | null;
                    target_locations?: string[] | null;
                };
                Update: {
                    budget_cents?: number | null;
                    budget_currency?: string | null;
                    company_id?: string;
                    created_at?: string | null;
                    creator_count?: number | null;
                    date_end_campaign?: string | null;
                    date_end_creator_outreach?: string | null;
                    date_start_campaign?: string | null;
                    description?: string;
                    id?: string;
                    media?: Json[] | null;
                    media_path?: string[] | null;
                    name?: string;
                    product_link?: string | null;
                    product_name?: string | null;
                    promo_types?: string[] | null;
                    purge_media?: Json[] | null;
                    requirements?: string | null;
                    slug?: string | null;
                    status?: string | null;
                    tag_list?: string[] | null;
                    target_locations?: string[] | null;
                };
            };
            companies: {
                Row: {
                    avatar_url: string | null;
                    created_at: string | null;
                    cus_id: string | null;
                    id: string;
                    name: string | null;
                    profiles_limit: string;
                    searches_limit: string;
                    subscription_status: string;
                    updated_at: string | null;
                    website: string | null;
                };
                Insert: {
                    avatar_url?: string | null;
                    created_at?: string | null;
                    cus_id?: string | null;
                    id?: string;
                    name?: string | null;
                    profiles_limit?: string;
                    searches_limit?: string;
                    subscription_status?: string;
                    updated_at?: string | null;
                    website?: string | null;
                };
                Update: {
                    avatar_url?: string | null;
                    created_at?: string | null;
                    cus_id?: string | null;
                    id?: string;
                    name?: string | null;
                    profiles_limit?: string;
                    searches_limit?: string;
                    subscription_status?: string;
                    updated_at?: string | null;
                    website?: string | null;
                };
            };
            invites: {
                Row: {
                    company_id: string;
                    created_at: string | null;
                    email: string;
                    expire_at: string | null;
                    id: string;
                    updated_at: string | null;
                    used: boolean;
                };
                Insert: {
                    company_id: string;
                    created_at?: string | null;
                    email: string;
                    expire_at?: string | null;
                    id?: string;
                    updated_at?: string | null;
                    used?: boolean;
                };
                Update: {
                    company_id?: string;
                    created_at?: string | null;
                    email?: string;
                    expire_at?: string | null;
                    id?: string;
                    updated_at?: string | null;
                    used?: boolean;
                };
            };
            profiles: {
                Row: {
                    admin: boolean | null;
                    avatar_url: string | null;
                    company_id: string | null;
                    created_at: string | null;
                    email: string | null;
                    first_name: string;
                    id: string;
                    last_name: string;
                    onboarding: boolean;
                    phone: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    admin?: boolean | null;
                    avatar_url?: string | null;
                    company_id?: string | null;
                    created_at?: string | null;
                    email?: string | null;
                    first_name: string;
                    id: string;
                    last_name: string;
                    onboarding?: boolean;
                    phone?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    admin?: boolean | null;
                    avatar_url?: string | null;
                    company_id?: string | null;
                    created_at?: string | null;
                    email?: string | null;
                    first_name?: string;
                    id?: string;
                    last_name?: string;
                    onboarding?: boolean;
                    phone?: string | null;
                    updated_at?: string | null;
                };
            };
            usages: {
                Row: {
                    company_id: string;
                    created_at: string | null;
                    id: string;
                    item_id: string | null;
                    type: string;
                    user_id: string;
                };
                Insert: {
                    company_id: string;
                    created_at?: string | null;
                    id?: string;
                    item_id?: string | null;
                    type: string;
                    user_id: string;
                };
                Update: {
                    company_id?: string;
                    created_at?: string | null;
                    id?: string;
                    item_id?: string | null;
                    type?: string;
                    user_id?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
