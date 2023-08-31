import { dummySequenceInfluencers } from 'src/components/sequences/dummy-sequence-influencers';
import { useUser } from 'src/hooks/use-user';
import type { SequenceInfluencerInsert, SequenceInfluencerUpdate } from 'src/utils/api/db';
import {
    createSequenceInfluencerCall,
    deleteSequenceInfluencerCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import { useDB } from 'src/utils/client-db/use-client-db';
import useSWR from 'swr';

export const useSequenceInfluencers = (sequenceIds?: string[], _filters?: string[]) => {
    const { profile } = useUser();

    const { data: sequenceInfluencers, mutate: refreshSequenceInfluencers } = useSWR(
        sequenceIds ? ['sequence_influencers', ...sequenceIds] : null,
        async () => {
            return dummySequenceInfluencers;
        },
    );

    const createSequenceInfluencerDBCall = useDB<typeof createSequenceInfluencerCall>(createSequenceInfluencerCall);
    const createSequenceInfluencer = async (
        influencerSocialProfileId: string,
        tags: string[],
        iqDataUserProfileId: string,
        email?: string | null,
    ) => {
        if (!sequenceIds || sequenceIds.length < 1) throw new Error('No sequenceIds provided');
        if (!profile?.company_id) throw new Error('No profile found');

        const insert: SequenceInfluencerInsert = {
            added_by: profile.id,
            company_id: profile.company_id,
            sequence_id: sequenceIds[0],
            influencer_social_profile_id: influencerSocialProfileId,
            sequence_step: 0,
            tags,
            funnel_status: 'To Contact',
            iqdata_id: iqDataUserProfileId,
            email,
        };
        const res = await createSequenceInfluencerDBCall(insert);
        return res;
    };

    const updateSequenceInfluencerDBCall = useDB(updateSequenceInfluencerCall);
    const updateSequenceInfluencer = async (update: SequenceInfluencerUpdate) => {
        const res = await updateSequenceInfluencerDBCall(update);
        refreshSequenceInfluencers();
        return res;
    };

    const deleteSequenceInfluencerDBCall = useDB<typeof deleteSequenceInfluencerCall>(deleteSequenceInfluencerCall);
    const deleteSequenceInfluencer = async (id: string) => {
        const res = await deleteSequenceInfluencerDBCall(id);
        refreshSequenceInfluencers();
        return res;
    };

    return {
        sequenceInfluencers,
        createSequenceInfluencer,
        updateSequenceInfluencer,
        refreshSequenceInfluencers,
        deleteSequenceInfluencer,
    };
};
