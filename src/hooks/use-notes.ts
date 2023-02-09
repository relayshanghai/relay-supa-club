import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { useUser } from './use-user';
import { clientLogger } from 'src/utils/logger';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { CampaignNotePostBody, CampaignNotePostResponse } from 'pages/api/notes/create';
import { CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult } from 'pages/api/notes';
import { CampaignNotesDB } from 'src/utils/api/db';

export const useNotes = ({ campaignCreatorId }: { campaignCreatorId?: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { profile } = useUser();

    const { data: campaignNotes } = useSWR(
        'notes',
        (path) =>
            nextFetchWithQueries<CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult>(path, {
                id: campaignCreatorId ?? '',
            }),
        { refreshInterval: 500 },
    );

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

    return {
        campaignNotes,
        loading,
        createNote,
        deleteNote,
    };
};
