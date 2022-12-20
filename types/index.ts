import { Database } from './supabase';

export type CreatorChannel = 'instagram' | 'youtube' | 'tiktok';

export type CreatorSearchResult = {
    /** number of results */
    total: number;
    accounts: CreatorSearchResultItem[];
    /** Returns only in case of auto_unhide=1 parameter has passed. Contains tokens amount charged for the unlock operation*/
    cost: number;
    /** Returns only in case of auto_unhide=1 parameter has passed. Contains list of unlocked user ids */
    shownAccounts: number[];
};

export type CreatorSearchResultItem = {
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
