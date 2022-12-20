import { Database } from './supabase';

export * from './iqdata';

export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';

export type LabelValueObject = { label: string; value: string };

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
