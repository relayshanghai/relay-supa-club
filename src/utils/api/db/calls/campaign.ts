//TODO TicketV2-146: Add types naming convention to comment
import { supabase } from 'src/utils/supabase-client';
import type {
    CampaignCreatorDBInsert,
    CampaignDBUpdate,
    CampaignCreatorDBUpdate,
    CampaignNotesInsertDB,
    CampaignNotesDB,
    ProfileDB,
} from '../types';

export type CampaignNotesWithProfiles = CampaignNotesDB & {
    profiles: Pick<ProfileDB, 'id' | 'first_name' | 'last_name'>;
};

export const updateCampaign = async (data: CampaignDBUpdate) =>
    await supabase
        .from('campaigns')
        .update({
            ...data,
        })
        .eq('id', data.id)
        .select()
        .single();

export const insertCampaignCreator = async (data: CampaignCreatorDBInsert) =>
    await supabase
        .from('campaign_creators')
        .insert({
            status: 'to contact',
            ...data,
        })
        .eq('campaign_id', data.campaign_id)
        .select()
        .single();

export const updateCampaignCreator = async (data: CampaignCreatorDBUpdate, campaign_id: string) =>
    await supabase.from('campaign_creators').update(data).eq('id', data.id).eq('campaign_id', campaign_id).single();

export const getCampaignNotes = async (campaignCreatorId: string) => {
    const { data, error } = await supabase
        .from('campaign_notes')
        .select('*, profiles(id, first_name, last_name)')
        .eq('campaign_creator_id', campaignCreatorId)
        .order('created_at', { ascending: true });
    if (error) throw error;

    return data as CampaignNotesWithProfiles[];
};

export const insertCampaignNote = async (note: CampaignNotesInsertDB) =>
    await supabase.from('campaign_notes').insert(note).select().single();
