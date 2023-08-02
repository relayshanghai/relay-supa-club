import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { DatabaseWithCustomTypes } from 'types';
import { getCampaignsCall, createCampaignCall, updateCampaignCall } from './campaigns';
import { getProfileByIdCall } from './profiles';
import { getCompanyByIdCall } from './companies';
import {
    deleteCampaignCreatorCall,
    getAllCampaignCreatorsByCampaignIdsCall,
    getCampaignCreatorsCall,
    insertCampaignCreatorCall,
    updateCampaignCreatorCall,
} from './campaignCreators';
import type { DBQuery } from '../types';
import { getSequenceByIdCall, getSequencesByCompanyIdCall, updateSequenceCall } from './sequences';
import { getSequenceStepsBySequenceIdCall, updateSequenceStepCall } from './sequence-steps';
import { getSequenceInfluencersBySequenceIdCall, updateSequenceInfluencerCall } from './sequence-influencers';
import { getInfluencerSocialProfileByIdCall } from './influencers';
import { getSequenceEmailsBySequenceCall, updateSequenceEmailCall } from './sequence-emails';

export const useSupabase = () => useSupabaseClient<DatabaseWithCustomTypes>();

export const useDB = <T extends DBQuery<(...args: any) => any>>(query: DBQuery<ReturnType<T>>) => {
    const supabase = useSupabase();
    return query(supabase);
};

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
        getAllCampaignCreatorsByCampaignIds: getAllCampaignCreatorsByCampaignIdsCall(supabaseClient),

        // companies
        getCompanyById: getCompanyByIdCall(supabaseClient),

        // sequences
        getSequencesByCompanyId: getSequencesByCompanyIdCall(supabaseClient),
        getSequenceById: getSequenceByIdCall(supabaseClient),
        updateSequence: updateSequenceCall(supabaseClient),

        // sequence_steps
        getSequenceStepsBySequenceId: getSequenceStepsBySequenceIdCall(supabaseClient),
        updateSequenceStep: updateSequenceStepCall(supabaseClient),

        // sequence_influencers
        getSequenceInfluencersBySequenceId: getSequenceInfluencersBySequenceIdCall(supabaseClient),
        updateSequenceInfluencer: updateSequenceInfluencerCall(supabaseClient),

        // sequence_influencers_sequence_steps
        getSequenceEmailsBySequence: getSequenceEmailsBySequenceCall(supabaseClient),
        updateSequenceEmail: updateSequenceEmailCall(supabaseClient),

        // influencer_social_profiles
        getInfluencerSocialProfileById: getInfluencerSocialProfileByIdCall(supabaseClient),
    };
};
