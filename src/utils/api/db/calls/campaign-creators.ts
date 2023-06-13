import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { CampaignCreatorDB } from '../types';

type CampaignCreatorUpdate = DatabaseWithCustomTypes['public']['Tables']['campaign_creators']['Update'];

export const getCampaignCreator =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (id: string): Promise<CampaignCreatorDB | null> => {
        const response = await db.from('campaign_creators').select().eq('id', id).maybeSingle();

        if (response.error) {
            throw response.error;
        }

        return response.data;
    };

export const updateCampaignCreator =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (id: string, data: CampaignCreatorUpdate): Promise<CampaignCreatorDB> => {
        const response = await db.from('campaign_creators').update(data).eq('id', id).select().single();

        if (response.error) {
            throw response.error;
        }

        return response.data;
    };
