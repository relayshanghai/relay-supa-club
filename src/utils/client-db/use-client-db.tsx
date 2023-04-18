import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { DatabaseWithCustomTypes } from 'types';
import { getCampaignWithCompanyCreatorsCall } from './campaigns';
import { getProfileByIdCall } from './profiles';
export const useClientDb = () => {
    const supabaseClient = useSupabaseClient<DatabaseWithCustomTypes>();

    // profiles
    const getProfileById = getProfileByIdCall(supabaseClient);

    // campaigns
    const getCampaignWithCompanyCreators = getCampaignWithCompanyCreatorsCall(supabaseClient);

    return {
        supabaseClient,
        getProfileById,
        getCampaignWithCompanyCreators,
    };
};
