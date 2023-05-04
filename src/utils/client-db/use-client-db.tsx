import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { DatabaseWithCustomTypes } from 'types';
import { getCampaignsCall, createCampaignCall, updateCampaignCall } from './campaigns';
import { getProfileByIdCall } from './profiles';
import { getCompanyByIdCall } from './companies';
import {
    deleteCampaignCreatorCall,
    getAllCampaignCreatorsCall,
    getCampaignCreatorsCall,
    insertCampaignCreatorCall,
    updateCampaignCreatorCall,
} from './campaignCreators';

export const useClientDb = () => {
    const supabaseClient = useSupabaseClient<DatabaseWithCustomTypes>();
    return {
        supabaseClient,
        // profiles
        getProfileById: getProfileByIdCall(supabaseClient),

        // campaigns
        getCampaigns: getCampaignsCall(supabaseClient),
        createCampaign: createCampaignCall(supabaseClient),
        updateCampaign: updateCampaignCall(supabaseClient),

        // campaignCreators
        getCampaignCreators: getCampaignCreatorsCall(supabaseClient),
        insertCampaignCreator: insertCampaignCreatorCall(supabaseClient),
        updateCampaignCreator: updateCampaignCreatorCall(supabaseClient),
        deleteCampaignCreator: deleteCampaignCreatorCall(supabaseClient),
        getAllCampaignCreators: getAllCampaignCreatorsCall(supabaseClient),

        // companies
        getCompanyById: getCompanyByIdCall(supabaseClient),
    };
};
