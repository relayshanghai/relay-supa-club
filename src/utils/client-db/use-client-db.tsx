import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { DatabaseWithCustomTypes } from 'types';

import { getCompanyByIdCall } from '../api/db/calls/companies';
import {
    deleteCampaignCreatorCall,
    getAllCampaignCreatorsByCampaignIdsCall,
    getCampaignCreatorsCall,
    insertCampaignCreatorCall,
    updateCampaignCreatorCall,
} from '../api/db/calls/campaignCreators';
import type { DBQuery } from '../types';
import { getSequenceEmailsBySequenceCall, updateSequenceEmailCall } from '../api/db/calls/sequence-emails';
import {
    getSequenceInfluencersBySequenceIdCall,
    updateSequenceInfluencerCall,
} from '../api/db/calls/sequence-influencers';
import { getSequenceStepsBySequenceIdCall, updateSequenceStepCall } from '../api/db/calls/sequence-steps';
import { getSequencesByCompanyIdCall, getSequenceByIdCall, updateSequenceCall } from '../api/db/calls/sequences';
import { getInfluencerSocialProfileByIdCall } from '../api/db/calls/influencers';
import { getProfileByIdCall } from '../api/db';
import { createCampaignCall, getCampaignsCall, updateCampaignCall } from '../api/db/calls/campaigns';

export const useSupabase = () => useSupabaseClient<DatabaseWithCustomTypes>();

export const useDB = <T extends DBQuery<(...args: any) => any>>(query: DBQuery<ReturnType<T>>) => {
    const supabase = useSupabase();
    return query(supabase);
};

/**
 * TO BE DEPRECATED. Don't add new calls here, just add the call to the api/db/calls folder and use the `useDB()` hook in the component.
 */
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
