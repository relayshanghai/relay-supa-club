import type { Database } from './supabase';
export type CreatorPlatform = 'instagram' | 'youtube' | 'tiktok';
export type SocialMediaPlatform = CreatorPlatform | 'email' | 'twitter' | 'facebook' | 'wechat';

export type LabelValueObject = { label: string; value: string };
export type LocationWeighted = { id: string; weight: number };

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
