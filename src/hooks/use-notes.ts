import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useUser } from './use-user';
import { clientLogger } from 'src/utils/logger';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { CampaignNotePostBody, CampaignNotePostResponse } from 'pages/api/notes/create';
import { CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult } from 'pages/api/notes';
import { CampaignNotesDB, CampaignNotesWithProfiles } from 'src/utils/api/db';

export const useNotes = ({ campaignCreatorId }: { campaignCreatorId?: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [campaignCreatorNotes, setCampaignCreatorNotes] = useState<CampaignNotesWithProfiles[]>(
        [],
    );
    const { profile } = useUser();

    const {
        data: campaignNotes,
        mutate: refreshNotes,
        isLoading,
    } = useSWR(
        'notes',
        (path) =>
            nextFetchWithQueries<CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult>(path, {
                id: campaignCreatorId ?? '',
            }),
        { refreshInterval: 500 },
    );

    useEffect(() => {
        if (campaignNotes && campaignNotes?.length > 0 && campaignCreatorId) {
            const campaignCreatorNotes = campaignNotes?.filter(
                (c) => c.campaign_creator_id === campaignCreatorId,
            );
            if (campaignCreatorNotes) setCampaignCreatorNotes(campaignCreatorNotes);
        }
    }, [campaignCreatorId, campaignNotes]);

    const createNote = useCallback(
        async (input: CampaignNotePostBody) => {
            setLoading(true);
            if (!profile) throw new Error('No profile found');
            try {
                const body: CampaignNotePostBody = {
                    ...input,
                };
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
        async (input: CampaignNotesDB) => {
            setLoading(true);
            if (!profile) throw new Error('No profile found');
            try {
                await nextFetch('notes/delete', {
                    method: 'delete',
                    body: { ...input, profileId: profile.id },
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
        async (input: CampaignNotesDB) => {
            setLoading(true);
            if (!profile) throw new Error('No profile found');
            try {
                await nextFetch('notes/update', {
                    method: 'put',
                    body: { input },
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
