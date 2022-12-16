export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    public: {
        Tables: {
            campaigns: {
                Row: {
                    id: string;
                    created_at: string | null;
                    name: string;
                    description: string;
                    company_id: string;
                    product_link: string | null;
                    status: string | null;
                    budget_cents: number | null;
                    budget_currency: string | null;
                    creator_count: number | null;
                    date_end_creator_outreach: string | null;
                    date_start_campaign: string | null;
                    date_end_campaign: string | null;
                    slug: string | null;
                    product_name: string | null;
                    requirements: string | null;
                    tag_list: string[] | null;
                    promo_types: string[] | null;
                    target_locations: string[] | null;
                    media: Json[] | null;
                    purge_media: Json[] | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string | null;
                    name: string;
                    description: string;
                    company_id: string;
                    product_link?: string | null;
                    status?: string | null;
                    budget_cents?: number | null;
                    budget_currency?: string | null;
                    creator_count?: number | null;
                    date_end_creator_outreach?: string | null;
                    date_start_campaign?: string | null;
                    date_end_campaign?: string | null;
                    slug?: string | null;
                    product_name?: string | null;
                    requirements?: string | null;
                    tag_list?: string[] | null;
                    promo_types?: string[] | null;
                    target_locations?: string[] | null;
                    media?: Json[] | null;
                    purge_media?: Json[] | null;
                };
                Update: {
                    id?: string;
                    created_at?: string | null;
                    name?: string;
                    description?: string;
                    company_id?: string;
                    product_link?: string | null;
                    status?: string | null;
                    budget_cents?: number | null;
                    budget_currency?: string | null;
                    creator_count?: number | null;
                    date_end_creator_outreach?: string | null;
                    date_start_campaign?: string | null;
                    date_end_campaign?: string | null;
                    slug?: string | null;
                    product_name?: string | null;
                    requirements?: string | null;
                    tag_list?: string[] | null;
                    promo_types?: string[] | null;
                    target_locations?: string[] | null;
                    media?: Json[] | null;
                    purge_media?: Json[] | null;
                };
            };
            companies: {
                Row: {
                    id: string;
                    created_at: string | null;
                    name: string | null;
                    website: string | null;
                    avatar_url: string | null;
                    updated_at: string | null;
                    cus_id: string | null;
                    usage_limit: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string | null;
                    name?: string | null;
                    website?: string | null;
                    avatar_url?: string | null;
                    updated_at?: string | null;
                    cus_id?: string | null;
                    usage_limit?: string;
                };
                Update: {
                    id?: string;
                    created_at?: string | null;
                    name?: string | null;
                    website?: string | null;
                    avatar_url?: string | null;
                    updated_at?: string | null;
                    cus_id?: string | null;
                    usage_limit?: string;
                };
            };
            invites: {
                Row: {
                    id: string;
                    created_at: string | null;
                    company_id: string;
                    email: string;
                    first_name: string | null;
                    last_name: string | null;
                    updated_at: string | null;
                    used: boolean;
                    expire_at: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string | null;
                    company_id: string;
                    email: string;
                    first_name?: string | null;
                    last_name?: string | null;
                    updated_at?: string | null;
                    used?: boolean;
                    expire_at?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string | null;
                    company_id?: string;
                    email?: string;
                    first_name?: string | null;
                    last_name?: string | null;
                    updated_at?: string | null;
                    used?: boolean;
                    expire_at?: string | null;
                };
            };
            profiles: {
                Row: {
                    id: string;
                    updated_at: string | null;
                    avatar_url: string | null;
                    phone: string | null;
                    created_at: string | null;
                    company_id: string | null;
                    admin: boolean | null;
                    last_name: string;
                    first_name: string;
                    email: string | null;
                    onboarding: boolean;
                };
                Insert: {
                    id: string;
                    updated_at?: string | null;
                    avatar_url?: string | null;
                    phone?: string | null;
                    created_at?: string | null;
                    company_id?: string | null;
                    admin?: boolean | null;
                    last_name: string;
                    first_name: string;
                    email?: string | null;
                    onboarding?: boolean;
                };
                Update: {
                    id?: string;
                    updated_at?: string | null;
                    avatar_url?: string | null;
                    phone?: string | null;
                    created_at?: string | null;
                    company_id?: string | null;
                    admin?: boolean | null;
                    last_name?: string;
                    first_name?: string;
                    email?: string | null;
                    onboarding?: boolean;
                };
            };
            usages: {
                Row: {
                    id: string;
                    created_at: string | null;
                    company_id: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string | null;
                    company_id: string;
                };
                Update: {
                    id?: string;
                    created_at?: string | null;
                    company_id?: string;
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
