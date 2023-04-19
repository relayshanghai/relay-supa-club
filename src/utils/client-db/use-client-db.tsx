import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { DatabaseWithCustomTypes } from 'types';
import { getCampaignsWithCompanyCreatorsCall } from './campaigns';
import { getProfileByIdCall } from './profiles';
export const useClientDb = () => {
    const supabaseClient = useSupabaseClient<DatabaseWithCustomTypes>();

    // profiles
    const getProfileById = getProfileByIdCall(supabaseClient);

    // campaigns
    const getCampaignsWithCompanyCreators = getCampaignsWithCompanyCreatorsCall(supabaseClient);

    return {
        supabaseClient,
        getProfileById,
        getCampaignsWithCompanyCreators,
    };
};
