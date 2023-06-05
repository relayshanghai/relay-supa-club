import type { SupabaseClient } from '@supabase/supabase-js';
import type { CampaignDB, CampaignCreatorDB, CampaignCreatorDBInsert, CampaignCreatorDBUpdate } from '../api/db';
import type { CreatorPlatform, DatabaseWithCustomTypes } from 'types';

export type CampaignWithCreators = CampaignDB & {
    campaign_creators: CampaignCreatorDB[];
};
export interface CampaignCreatorInsert extends CampaignCreatorDBInsert {
    campaign_id: string;
    added_by_id: string;
    platform: CreatorPlatform;
}
export const getCampaignCreatorsCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (campaignId?: string | null): Promise<CampaignCreatorDB[]> => {
        if (!campaignId) {
            return [];
        }

        const { data, error } = await supabaseClient
            .from('campaign_creators')
            .select('*')
            .eq('campaign_id', campaignId);

        if (error) throw error;

        await supabaseClient.from('campaigns').update({ updated_at: new Date().toISOString() }).eq('id', campaignId);

        return data;
    };

export const insertCampaignCreatorCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: CampaignCreatorInsert): Promise<CampaignCreatorDB> => {
        data.updated_at = new Date().toISOString();
        data.created_at = new Date().toISOString();
        const { data: campaignCreator, error } = await supabaseClient
            .from('campaign_creators')
            .insert({
                ...data,
            })
            .eq('campaign_id', data.campaign_id)
            .select()
            .single();
        if (error) throw error;

        await supabaseClient
            .from('campaigns')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', data.campaign_id);

        return campaignCreator;
    };

export const updateCampaignCreatorCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: CampaignCreatorDBUpdate): Promise<CampaignCreatorDBUpdate> => {
        const { id, ...rest } = data;
        rest.updated_at = new Date().toISOString();
        const { data: campaignCreator, error } = await supabaseClient
            .from('campaign_creators')
            .update(rest)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;

        await supabaseClient
            .from('campaigns')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', data.campaign_id);

        return campaignCreator;
    };

export const deleteCampaignCreatorCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) =>
    async ({ creatorId, campaignId }: { creatorId: string; campaignId: string }) => {
        const { data: campaignCreator, error } = await supabaseClient
            .from('campaign_creators')
            .delete()
            .eq('id', creatorId)
            .eq('campaign_id', campaignId);

        if (error) throw error;

        await supabaseClient.from('campaigns').update({ updated_at: new Date().toISOString() }).eq('id', campaignId);

        return campaignCreator;
    };

export type CampaignCreatorBasicInfo = Pick<CampaignCreatorDB, 'campaign_id' | 'creator_id'>;

export const getAllCampaignCreatorsByCampaignIdsCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (campaignIds: string[]): Promise<CampaignCreatorBasicInfo[]> => {
        if (!campaignIds || campaignIds.length === 0) {
            return [];
        }
        const { data, error } = await supabaseClient
            .from('campaign_creators')
            .select('campaign_id, creator_id')
            .in('campaign_id', campaignIds);

        // note, this is quite large. I had to increase the database's limit above 1000 to get this to work.

        if (error) throw error;
        return data;
    };
