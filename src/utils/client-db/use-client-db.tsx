import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { DatabaseWithCustomTypes } from 'types';

import {
    deleteCampaignCreatorCall,
    getAllCampaignCreatorsByCampaignIdsCall,
    getCampaignCreatorsCall,
    insertCampaignCreatorCall,
    updateCampaignCreatorCall,
} from '../api/db/calls/campaignCreators';
import { createCampaignCall, getCampaignsCall, updateCampaignCall } from '../api/db/calls/campaigns';
import { getCompanyByIdCall } from '../api/db/calls/companies';
import { getInfluencerSocialProfileByIdCall } from '../api/db/calls/influencers';
import { getProfileByIdCall } from '../api/db/calls/profiles';
import { getSequenceInfluencersBySequenceIdCall } from '../api/db/calls/sequence-influencers';
import { getSequenceStepsBySequenceIdCall, updateSequenceStepCall } from '../api/db/calls/sequence-steps';
import { getSequenceByIdCall, getSequencesByCompanyIdCall, updateSequenceCall } from '../api/db/calls/sequences';
import type { DBQuery } from '../types';
import { isPostgrestError, normalizePostgrestError } from 'src/errors/postgrest-error';

export const useSupabase = () => useSupabaseClient<DatabaseWithCustomTypes>();

export const useDB = <T extends DBQuery>(query: T) => {
    const supabase = useSupabase();

    const q = async (...args: Parameters<ReturnType<T>>) => {
        try {
            return await query(supabase)(...args);
        } catch (error) {
            if (isPostgrestError(error)) {
                error = normalizePostgrestError(error);
            }
            throw error;
        }
    };

    return q as ReturnType<T>;
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

        // influencer_social_profiles
        getInfluencerSocialProfileById: getInfluencerSocialProfileByIdCall(supabaseClient),
    };
};
