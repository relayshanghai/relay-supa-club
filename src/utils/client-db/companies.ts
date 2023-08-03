import type { RelayDatabase } from '../api/db';

export const getCompanyByIdCall = (supabaseClient: RelayDatabase) => async (companyId?: string | null) => {
    if (!companyId) return;
    // If this query changes, make sure to update the CampaignWithCompany type
    const { data, error } = await supabaseClient.from('companies').select('*').eq('id', companyId).single();

    if (error) throw error;
    return data;
};
