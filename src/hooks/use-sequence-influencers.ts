import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type {
    SequenceInfluencersDeleteRequestBody,
    SequenceInfluencersDeleteResponse,
} from 'pages/api/sequence/influencers/delete';
import { useUser } from 'src/hooks/use-user';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { SequenceInfluencerInsert, SequenceInfluencerUpdate } from 'src/utils/api/db';
import {
    createSequenceInfluencerCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import { useDB } from 'src/utils/client-db/use-client-db';
import { nextFetch } from 'src/utils/fetcher';
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
        influencerSocialProfile: Omit<
            SequenceInfluencerInsert,
            'added_by' | 'company_id' | 'sequence_step' | 'funnel_status' | 'rate_amount' | 'rate_currency'
        >,
    ) => {
        if (!sequenceIds || sequenceIds.length < 1) throw new Error('No sequenceIds provided');
        if (!profile?.company_id) throw new Error('No profile found');

        const insert: SequenceInfluencerInsert = {
            ...influencerSocialProfile,
            added_by: profile.id,
            company_id: profile.company_id,
            sequence_step: 0,
            funnel_status: 'To Contact',
            rate_amount: 0,
            rate_currency: 'USD',
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

    const deleteSequenceInfluencers = async (ids: string[]) => {
        const body: SequenceInfluencersDeleteRequestBody = { ids };
        // optimistic update
        refreshSequenceInfluencers((prev) => prev?.filter((i) => !ids.includes(i.id)) ?? []);
        const res = await nextFetch<SequenceInfluencersDeleteResponse>('sequence/influencers/delete', {
            method: 'POST',
            body,
        });
        refreshSequenceInfluencers();
        return res;
    };

    return {
        sequenceInfluencers,
        createSequenceInfluencer,
        updateSequenceInfluencer,
        refreshSequenceInfluencers,
        deleteSequenceInfluencers,
    };
};
