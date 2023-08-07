import useSWR from 'swr';

import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { createSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';
import type { SequenceInfluencerInsert } from 'src/utils/api/db';
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
    const createSequenceInfluencer = async (insert: SequenceInfluencerInsert) => {
        if (!sequenceId) throw new Error('No sequenceId provided');
        if (!profile?.company_id) throw new Error('No profile found');
        try {
            const body: SequenceInfluencerInsert = {
                ...insert,
                added_by: profile.id,
                company_id: profile.company_id,
                sequence_id: sequenceId,
                // influencer_social_profile_id: ??,
                sequence_step: 0,
                tags: [],
                funnel_status: 'To Contact',
            };
            const res = await createSequenceInfluencerDBCall(body);
            return res;
        } catch (error) {
            clientLogger(error, 'error');
        }
    };

    return {
        sequenceInfluencers,
        updateSequenceInfluencer: db.updateSequenceInfluencer,
        createSequenceInfluencer,
        refreshSequenceInfluencers,
    };
};
