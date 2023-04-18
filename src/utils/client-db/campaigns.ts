import type { SupabaseClient } from '@supabase/supabase-js';
import type { CampaignDB, CompanyDB, CampaignCreatorDB } from '../api/db';
import type { DatabaseWithCustomTypes } from 'types';

export type CampaignWithCompanyCreators = CampaignDB & {
    companies: Pick<CompanyDB, 'id' | 'name' | 'cus_id'>;
    campaign_creators: CampaignCreatorDB[];
};

export const getCampaignWithCompanyCreatorsCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (companyId?: string | null) => {
        if (!companyId) return;
        // If this query changes, make sure to update the CampaignWithCompany type
        const { data, error } = await supabaseClient
            .from('campaigns')
            .select('*, companies(id, name, cus_id), campaign_creators(*)')
            .eq('company_id', companyId);

        if (error) throw error;
        return data as CampaignWithCompanyCreators[];
    };
