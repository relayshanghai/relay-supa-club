import type { SequenceInfluencerManagerPageWithChannelData } from 'pages/api/sequence/influencers';
import type {
    SequenceInfluencersDeleteRequestBody,
    SequenceInfluencersDeleteResponse,
} from 'pages/api/sequence/influencers/delete';
import { type AddInfluencerRequest } from 'pages/api/v2/sequences/[id]/influencers/request';
import { useCallback } from 'react';
import { useUser } from 'src/hooks/use-user';
import { useApiClient } from 'src/utils/api-client/request';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { SequenceInfluencerInsert, SequenceInfluencerUpdate } from 'src/utils/api/db';
import { updateSequenceInfluencerCall } from 'src/utils/api/db/calls/sequence-influencers';
import { useDB } from 'src/utils/client-db/use-client-db';
import { nextFetch } from 'src/utils/fetcher';
import useSWR from 'swr';

/** If you only want to use `refresh` or `create`, no need to pass sequenceIds. If you don't pass sequenceIds it will not call the fetch */
export const useSequenceInfluencers = (sequenceIds?: string[]) => {
    const { profile } = useUser();
    const { error, apiClient } = useApiClient();
    const {
        data,
        mutate: refreshSequenceInfluencers,
        isLoading,
        isValidating,
    } = useSWR<SequenceInfluencerManagerPageWithChannelData[]>(
        sequenceIds && sequenceIds.length > 0 ? ['sequence_influencers', ...sequenceIds] : null,
        async () => {
            const allInfluencers = await apiFetch<SequenceInfluencerManagerPageWithChannelData[], any>(
                '/api/sequence/influencers',
                {
                    body: sequenceIds,
                },
            );
            return allInfluencers.content;
        },
        { revalidateOnFocus: true },
    );
    const sequenceInfluencers = data && Array.isArray(data) ? data : [];

    const createSequenceInfluencer = useCallback(
        async (
            influencerSocialProfile: Omit<
                SequenceInfluencerInsert,
                'added_by' | 'company_id' | 'sequence_step' | 'funnel_status' | 'rate_amount' | 'rate_currency'
            >,
        ) => {
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
            const res = await apiClient.post(`/v2/sequences/${influencerSocialProfile.sequence_id}/influencers`, {
                influencers: [
                    {
                        avatarUrl: insert.avatar_url,
                        iqdataId: insert.iqdata_id,
                        name: insert.name,
                        platform: insert.platform,
                        rateAmount: insert.rate_amount,
                        rateCurrency: insert.rate_currency,
                        sequenceStep: insert.sequence_step,
                        url: insert.url,
                        username: insert.username,
                    } as AddInfluencerRequest,
                ],
            });
            return res.data;
        },
        [apiClient, profile?.company_id, profile?.id],
    );

    const updateSequenceInfluencerDBCall = useDB(updateSequenceInfluencerCall);
    const updateSequenceInfluencer = useCallback(
        async (update: SequenceInfluencerUpdate) => {
            const res = await updateSequenceInfluencerDBCall(update);
            refreshSequenceInfluencers();
            return res;
        },
        [refreshSequenceInfluencers, updateSequenceInfluencerDBCall],
    );

    const deleteSequenceInfluencers = useCallback(
        async (ids: string[]) => {
            const body: SequenceInfluencersDeleteRequestBody = { ids };
            // optimistic update
            refreshSequenceInfluencers((prev) => prev?.filter((i) => !ids.includes(i.id)) ?? [], { revalidate: false });
            const res = await nextFetch<SequenceInfluencersDeleteResponse>('sequence/influencers/delete', {
                method: 'POST',
                body,
            });
            refreshSequenceInfluencers();
            return res;
        },
        [refreshSequenceInfluencers],
    );

    const exportInfluencersToCsv = useCallback(
        async (influencers: string[]) => {
            const i = influencers.map((id) => ({ id }));
            const res = await apiClient.post(
                '/sequence/influencers/export',
                { influencers: i },
                {
                    responseType: 'blob',
                },
            );
            return res.data;
        },
        [apiClient],
    );

    return {
        loading:
            isLoading || (!sequenceInfluencers && isValidating) || (sequenceInfluencers.length === 0 && isValidating),
        sequenceInfluencers,
        createSequenceInfluencer,
        updateSequenceInfluencer,
        refreshSequenceInfluencers,
        deleteSequenceInfluencers,
        exportInfluencersToCsv,
        error,
    };
};
