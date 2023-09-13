import type { SequenceSendPostBody, SequenceSendPostResponse } from 'pages/api/sequence/send';
import { useUser } from 'src/hooks/use-user';
import { CreateSequence } from 'src/utils/analytics/events';
import type { SequenceInfluencer, SequenceInsert, SequenceUpdate } from 'src/utils/api/db';
import { createSequenceCall, deleteSequenceCall, updateSequenceCall } from 'src/utils/api/db/calls/sequences';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { nextFetch } from 'src/utils/fetcher';
import { serverLogger } from 'src/utils/logger-server';
import useSWR from 'swr';
import { useRudderstackTrack } from './use-rudderstack';
import { useSequenceSteps } from './use-sequence-steps';
import { useSequences } from './use-sequences';

export const useSequence = (sequenceId?: string) => {
    const { profile } = useUser();
    const { track } = useRudderstackTrack();

    const db = useClientDb();
    const { refreshSequences } = useSequences();
    const { data: sequence, mutate: refreshSequence } = useSWR(
        sequenceId ? [sequenceId, 'sequences'] : null,
        ([sequenceId]) => db.getSequenceById(sequenceId),
    );
    const { sequenceSteps, refreshSequenceSteps } = useSequenceSteps(sequence?.id);

    const updateSequenceDBCall = useDB<typeof updateSequenceCall>(updateSequenceCall);
    const updateSequence = async (update: SequenceUpdate & { id: string }) => {
        const res = await updateSequenceDBCall(update);
        refreshSequence();
        return res;
    };

    const deleteSequenceDBCall = useDB<typeof deleteSequenceCall>(deleteSequenceCall);
    const deleteSequence = async (ids: string[]) => {
        const res = await deleteSequenceDBCall(ids);
        refreshSequence();
        refreshSequences();
        return res;
    };

    const createSequenceDBCall = useDB<typeof createSequenceCall>(createSequenceCall);
    const createSequence = async (sequenceName: string) => {
        if (!profile?.company_id) throw new Error('No profile found');
        try {
            const insert: SequenceInsert = {
                company_id: profile.company_id,
                name: sequenceName,
                auto_start: false,
                manager_id: profile.id,
                manager_first_name: profile.first_name,
            };
            const res = await createSequenceDBCall(insert);
            refreshSequences();
            refreshSequenceSteps();
            return res;
        } catch (error) {
            track(CreateSequence, {
                sequence_id: null,
                is_success: false,
                extra_info: { error: String(error) },
            });
            serverLogger(error);
        }
    };

    const sendSequence = async (sequenceInfluencers: SequenceInfluencer[]) => {
        if (!profile?.email_engine_account_id) {
            throw new Error('No email account found');
        }
        const body: SequenceSendPostBody = {
            account: profile.email_engine_account_id,
            sequenceInfluencers,
        };
        return await nextFetch<SequenceSendPostResponse>('sequence/send', {
            method: 'POST',
            body,
        });
    };

    return {
        sequence,
        refreshSequence,
        sequenceSteps,
        updateSequence,
        deleteSequence,
        createSequence,
        sendSequence,
    };
};
