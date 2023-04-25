import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { DatabaseWithCustomTypes } from 'types';
import { getCampaignsWithCompanyCreatorsCall } from './campaigns';
import { getProfileByIdCall } from './profiles';
import { getCompanyByIdCall } from './companies';
export const useClientDb = () => {
    const supabaseClient = useSupabaseClient<DatabaseWithCustomTypes>();

    // profiles
    const getProfileById = getProfileByIdCall(supabaseClient);

    // campaigns
    const getCampaignsWithCompanyCreators = getCampaignsWithCompanyCreatorsCall(supabaseClient);

    // companies
    const getCompanyById = getCompanyByIdCall(supabaseClient);

    return {
        supabaseClient,
        getProfileById,
        getCampaignsWithCompanyCreators,
        getCompanyById,
    };
};
