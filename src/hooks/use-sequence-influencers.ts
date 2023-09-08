import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useUser } from 'src/hooks/use-user';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { SequenceInfluencerInsert, SequenceInfluencerUpdate } from 'src/utils/api/db';
import {
    createSequenceInfluencerCall,
    deleteSequenceInfluencerCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import { useDB } from 'src/utils/client-db/use-client-db';
import useSWR from 'swr';

export const useSequenceInfluencers = (sequenceIds?: string[]) => {
    const { profile } = useUser();

    const { data, mutate: refreshSequenceInfluencers } = useSWR<SequenceInfluencerManagerPage[]>(
        sequenceIds ? ['sequence_influencers', ...sequenceIds] : null,
        async () => {
            const allInfluencers = await apiFetch<SequenceInfluencerManagerPage[]>('/api/sequence/influencers', {
                body: sequenceIds,
            });
            return allInfluencers.content;
        },
    );
    const sequenceInfluencers = data && Array.isArray(data) ? data : [];

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
