import useSWR from 'swr';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import {
    createSequenceInfluencerCall,
    updateSequenceInfluencerCall,
    deleteSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import type { SequenceInfluencerInsert, SequenceInfluencerUpdate } from 'src/utils/api/db';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger-client';

export const useSequenceInfluencers = (sequenceId?: string) => {
    const db = useClientDb();
    const { profile } = useUser();

    const { data: sequenceInfluencers, mutate: refreshSequenceInfluencers } = useSWR(
        sequenceId ? 'sequence_influencers' : null,
        () => db.getSequenceInfluencersBySequenceId(sequenceId ?? ''),
    );

    const createSequenceInfluencerDBCall = useDB<typeof createSequenceInfluencerCall>(createSequenceInfluencerCall);
    const createSequenceInfluencer = async (influencerSocialProfileId: string, tags: string[] | []) => {
        if (!sequenceId) throw new Error('No sequenceId provided');
        if (!profile?.company_id) throw new Error('No profile found');
        try {
            const insert: SequenceInfluencerInsert = {
                added_by: profile.id,
                company_id: profile.company_id,
                sequence_id: sequenceId,
                influencer_social_profile_id: influencerSocialProfileId,
                sequence_step: 0,
                tags,
                funnel_status: 'To Contact',
            };
            const res = await createSequenceInfluencerDBCall(insert);
            return res;
        } catch (error) {
            clientLogger(error, 'error');
        }
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
