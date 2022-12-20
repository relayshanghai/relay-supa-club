import { Database } from './supabase';

export type CreatorChannel = 'instagram' | 'youtube' | 'tiktok';

export type SearchResultItem = {
    account: {
        user_profile: {
            user_id: string;
            username?: string;
            fullname?: string;
            custom_name?: string;
            url: string;
            picture: string;
            is_verified: true;
            followers: number;
            engagements: number;
            engagement_rate: number;
            avg_views: number;
        };
        audience_source: string;
    };
    match: {};
};

export type LabelValueObject = { label: string; value: string };

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
