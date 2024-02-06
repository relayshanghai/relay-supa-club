import type { SequenceSendPostBody, SequenceSendPostResponse } from 'pages/api/sequence/send';
import { useUser } from 'src/hooks/use-user';
import { CreateSequence } from 'src/utils/analytics/events';
import type { FunnelStatus, SequenceInsert, SequenceStep, SequenceUpdate } from 'src/utils/api/db';
import { createSequenceCall, deleteSequenceCall, updateSequenceCall } from 'src/utils/api/db/calls/sequences';
import { useClientDb, useDB } from 'src/utils/client-db/use-client-db';
import { nextFetch } from 'src/utils/fetcher';
import { serverLogger } from 'src/utils/logger-server';
import useSWR from 'swr';
import { useRudderstackTrack } from './use-rudderstack';
import { useSequences } from './use-sequences';
import type { SequenceInfluencerManagerPageWithChannelData } from 'pages/api/sequence/influencers';
import { useTemplateVariables } from './use-template_variables';
import { getSequenceInfluencersBySequenceIdsCall } from 'src/utils/api/db/calls/sequence-influencers';
import type {
    SequenceInfluencersDeleteRequestBody,
    SequenceInfluencersDeleteResponse,
} from 'pages/api/sequence/influencers/delete';
import { useCallback } from 'react';

export const useSequence = (sequenceId?: string) => {
    const { profile } = useUser();
    const { track } = useRudderstackTrack();

    const db = useClientDb();
    const { refreshSequences } = useSequences();
    const { templateVariables } = useTemplateVariables(sequenceId);
    const { data: sequence, mutate: refreshSequence } = useSWR(sequenceId ? [sequenceId, 'sequences'] : null, ([id]) =>
        db.getSequenceById(id),
    );

    const updateSequenceDBCall = useDB<typeof updateSequenceCall>(updateSequenceCall);
    const updateSequence = useCallback(
        async (update: SequenceUpdate & { id: string }) => {
            const res = await updateSequenceDBCall(update);
            refreshSequence();
            return res;
        },
        [updateSequenceDBCall, refreshSequence],
    );

    const deleteSequenceDBCall = useDB<typeof deleteSequenceCall>(deleteSequenceCall);
    const getInfluencersBySequenceIdsCall = useDB(getSequenceInfluencersBySequenceIdsCall);
    const deleteSequence = useCallback(
        async (ids: string[]) => {
            try {
                refreshSequence((prev) => (prev ? { ...prev, deleted: true } : prev), { revalidate: false });
                refreshSequences((prev) => prev?.filter(({ id }) => !ids.includes(id)), { revalidate: false });
                const res = await deleteSequenceDBCall(ids);
                const sequenceInfluencers = await getInfluencersBySequenceIdsCall(ids);
                /** only delete them if they are not yet in the manager page */
                const sequenceInfluencerTypesToDelete: FunnelStatus[] = ['To Contact', 'In Sequence', 'Ignored'];
                const sequenceInfluencerIds = sequenceInfluencers
                    .filter(({ funnel_status }) => sequenceInfluencerTypesToDelete.includes(funnel_status))
                    .map(({ id }) => id);
                const body: SequenceInfluencersDeleteRequestBody = { ids: sequenceInfluencerIds };
                await nextFetch<SequenceInfluencersDeleteResponse>('sequence/influencers/delete', {
                    method: 'POST',
                    body,
                });

                return res;
            } catch (error) {
                refreshSequence();
                refreshSequences();
            }
        },
        [deleteSequenceDBCall, getInfluencersBySequenceIdsCall, refreshSequence, refreshSequences],
    );

    const createSequenceDBCall = useDB<typeof createSequenceCall>(createSequenceCall);
    const createSequence = useCallback(
        async (sequenceName: string) => {
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
                refreshSequences((prev) => (prev ? [...prev, res] : prev));
                return res;
            } catch (error) {
                track(CreateSequence, {
                    sequence_id: null,
                    sequence_name: sequenceName,
                    is_success: false,
                    extra_info: { error: String(error) },
                });
                serverLogger(error);
            }
        },
        [profile, createSequenceDBCall, refreshSequences, track],
    );

    const sendSequence = useCallback(
        async (sequenceInfluencers: SequenceInfluencerManagerPageWithChannelData[], sequenceSteps: SequenceStep[]) => {
            if (!profile?.email_engine_account_id) {
                throw new Error('No email account found');
            }
            const body: SequenceSendPostBody = {
                account: profile.email_engine_account_id,
                sequenceInfluencers,
                sequenceSteps: sequenceSteps ?? [],
                templateVariables: templateVariables ?? [],
            };
            return await nextFetch<SequenceSendPostResponse>('sequence/send', {
                method: 'POST',
                body,
            });
        },
        [profile, templateVariables],
    );

    return {
        sequence,
        refreshSequence,
        updateSequence,
        deleteSequence,
        createSequence,
        sendSequence,
    };
};
