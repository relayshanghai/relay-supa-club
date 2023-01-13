import { supabase } from 'src/utils/supabase-client';
import {
    CompanyDB,
    CampaignCreatorDB,
    CampaignCreatorDBInsert,
    CampaignDBUpdate,
    CampaignCreatorDBUpdate,
    CampaignDB
} from '../types';

export type CampaignWithCompanyCreators = CampaignDB & {
    companies: Pick<CompanyDB, 'id' | 'name' | 'cus_id'>;
    campaign_creators: CampaignCreatorDB[];
};

export const getCampaignWithCompanyCreators = async (companyId: string) =>
    // If this query changes, make sure to update the CampaignWithCompany type
    await supabase
        .from('campaigns')
        .select('*, companies(id, name, cus_id), campaign_creators(*)')
        .eq('company_id', companyId);

export const updateCampaign = async (data: CampaignDBUpdate) =>
    await supabase
        .from('campaigns')
        .update({
            ...data
        })
        .eq('id', data.id)
        .select()
        .single();

export const insertCampaignCreator = async (data: CampaignCreatorDBInsert, campaign_id: string) =>
    await supabase
        .from('campaign_creators')
        .insert({
            campaign_id,
            status: 'to contact',
            ...data
        })
        .eq('campaign_id', campaign_id)
        .select()
        .single();

export const updateCampaignCreator = async (data: CampaignCreatorDBUpdate, campaign_id: string) =>
    await supabase
        .from('campaign_creators')
        .update(data)
        .eq('campaign_id', campaign_id)
        .select()
        .single();
