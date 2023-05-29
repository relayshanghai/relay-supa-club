import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'types/supabase';

type CampaignCreatorUpdate = Database['public']['Tables']['campaign_creators']['Update'];

export const updateCampaignCreator = (db: SupabaseClient) => async (id: string, data: CampaignCreatorUpdate) => {
    const response = await db.from('campaign_creators').update(data).eq('id', id).single();

    if (response.error) {
        throw response.error;
    }

    return response.data;
};
