import { Database } from './supabase';

export type LabelValueObject = { label: string; value: string };

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
