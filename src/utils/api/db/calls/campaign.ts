//TODO TicketV2-146: Add types naming convention to comment
import { supabase } from 'src/utils/supabase-client';
import type {
    CompanyDB,
    CampaignCreatorDB,
    CampaignCreatorDBInsert,
    CampaignDBUpdate,
    CampaignCreatorDBUpdate,
    CampaignDB,
    CampaignNotesInsertDB,
    CampaignNotesDB,
    ProfileDB,
} from '../types';

export type CampaignWithCompanyCreators = CampaignDB & {
    companies: Pick<CompanyDB, 'id' | 'name' | 'cus_id'>;
    campaign_creators: CampaignCreatorDB[];
};

export type CampaignNotesWithProfiles = CampaignNotesDB & {
    profiles: Pick<ProfileDB, 'id' | 'first_name' | 'last_name'>;
};

export const getCampaignWithCompanyCreators = async (companyId: string) => {
    // If this query changes, make sure to update the CampaignWithCompany type
    const { data, error } = await supabase
        .from('campaigns')
        .select('*, companies(id, name, cus_id), campaign_creators(*)')
        .eq('company_id', companyId)
        .neq('archived', true);

    if (error) throw error;
    return data as CampaignWithCompanyCreators[];
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
