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
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';
export const useSupabase = () => useSupabaseClient<DatabaseWithCustomTypes>();

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const useDB = <T extends DBQuery>(query: T) => {
    const supabase = useSupabase();

    useAuth()
        .getToken({ template: 'supabase' })
        .then(async (token) => {
            if (!token) return;
            const sesh = await supabase.auth.getSession();
            if (!sesh) return;
            const { session } = sesh.data;
            if (session) {
                session.access_token = token;
                await supabase.auth.setSession(session);
            }
        });
    return query(supabase) as ReturnType<T>;
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
