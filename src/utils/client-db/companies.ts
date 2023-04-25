import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export const getCompanyByIdCall =
    (supabaseClient: SupabaseClient<DatabaseWithCustomTypes>) => async (companyId?: string | null) => {
        if (!companyId) return;
        // If this query changes, make sure to update the CampaignWithCompany type
        const { data, error } = await supabaseClient.from('companies').select('*').eq('id', companyId).single();

        if (error) throw error;
        return data;
    };
