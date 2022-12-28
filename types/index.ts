import { Database } from './supabase';

export * from './iqdata';

export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = { id: string; weight: number };

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
export type CampaignCreatorDB = Database['public']['Tables']['campaign_creators']['Row'];
export type CampaignCreatorDBInsert = Database['public']['Tables']['campaign_creators']['Insert'];
