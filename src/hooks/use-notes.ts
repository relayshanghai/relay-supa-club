import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useUser } from './use-user';
import { clientLogger } from 'src/utils/logger-client';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import type { CampaignNotePostBody, CampaignNotePostResponse } from 'pages/api/notes/create';
import type { CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult } from 'pages/api/notes';
import type { CampaignNotesDB, CampaignNotesWithProfiles } from 'src/utils/api/db';
import type { CampaignNotesUpdatePutBody, CampaignNotesUpdatePutResult } from 'pages/api/notes/update';
import type { CampaignNotesDeleteBody, CampaignNotesDeleteResponse } from 'pages/api/notes/delete';

export const useNotes = ({ campaignCreatorId }: { campaignCreatorId?: string | null }) => {
    if (campaignCreatorId === null) {
        throw new Error('campaign_creator_id is required');
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [campaignCreatorNotes, setCampaignCreatorNotes] = useState<CampaignNotesWithProfiles[]>([]);
    const { profile } = useUser();

    const {
        data: campaignNotes,
        mutate: refreshNotes,
        isLoading,
    } = useSWR(
        campaignCreatorId ? [campaignCreatorId, 'notes'] : null,
        ([id, path]) =>
            nextFetchWithQueries<CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult>(path, {
                id,
            }),
        { refreshInterval: 500 },
    );

    useEffect(() => {
        if (campaignNotes && campaignNotes?.length > 0 && campaignCreatorId) {
            const campaignCreatorNotes = campaignNotes?.filter((c) => c.campaign_creator_id === campaignCreatorId);
            if (campaignCreatorNotes) setCampaignCreatorNotes(campaignCreatorNotes);
        }
    }, [campaignCreatorId, campaignNotes]);

    const createNote = useCallback(
        async (input: CampaignNotePostBody) => {
            setLoading(true);
            if (!profile) throw new Error('No profile found');
            try {
                const body: CampaignNotePostBody = input;
                await nextFetch<CampaignNotePostResponse>('notes/create', {
                    method: 'post',
                    body,
                });
            } catch (error: any) {
                clientLogger(error, 'error');
            } finally {
                setLoading(false);
            }
        },
        [profile],
    );

    const deleteNote = useCallback(
        async ({ id }: CampaignNotesDB) => {
            setLoading(true);
            if (!profile) throw new Error('No profile found');
            const body: CampaignNotesDeleteBody = {
                id,
                profileId: profile.id,
            };
            try {
                await nextFetch<CampaignNotesDeleteResponse>('notes/delete', {
                    method: 'delete',
                    body,
                });
            } catch (error: any) {
                clientLogger(error, 'error');
            } finally {
                setLoading(false);
            }
        },
        [profile],
    );

    const updateNote = useCallback(
        async ({ id, important }: CampaignNotesDB) => {
            setLoading(true);
            if (!profile) throw new Error('No profile found');
            const body: CampaignNotesUpdatePutBody = {
                id,
                important,
            };
            try {
                await nextFetch<CampaignNotesUpdatePutResult>('notes/update', {
                    method: 'put',
                    body,
                });
            } catch (error: any) {
                clientLogger(error, 'error');
            } finally {
                setLoading(false);
            }
        },
        [profile],
    );

    return {
        isLoading,
        campaignNotes,
        loading,
        createNote,
        deleteNote,
        updateNote,
        refreshNotes,
        campaignCreatorNotes,
    };
};
