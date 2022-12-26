import { Database } from './supabase';

export * from './iqdata';

export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = { id: string; weight: number };

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
export type CampaignCreate = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];
