import type { Database } from 'types/supabase';

export type ProfileDB = Database['public']['Tables']['profiles']['Row'];

export type CompanyDB = Database['public']['Tables']['companies']['Row'];
export type CompanyDBUpdate = Database['public']['Tables']['companies']['Update'];

export type CampaignDB = Database['public']['Tables']['campaigns']['Row'];
export type CampaignDBUpdate = Database['public']['Tables']['campaigns']['Update'];
export type CampaignDBInsert = Database['public']['Tables']['campaigns']['Insert'];

export type CampaignCreatorDB = Database['public']['Tables']['campaign_creators']['Row'];
export type CampaignCreatorDBInsert = Database['public']['Tables']['campaign_creators']['Insert'];
export type CampaignCreatorDBUpdate = Database['public']['Tables']['campaign_creators']['Update'];

export type UsagesDB = Database['public']['Tables']['usages']['Row'];
export type UsagesDBInsert = Database['public']['Tables']['usages']['Insert'];

export type InvitesDB = Database['public']['Tables']['invites']['Row'];
