import { useCallback, useState } from 'react';
import { useUser } from './use-user';
import { clientLogger } from 'src/utils/logger';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { CampaignNotePostBody, CampaignNotePostResponse } from 'pages/api/notes/create';
import useSWR from 'swr';
import { CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult } from 'pages/api/notes';

export const useNotes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { profile } = useUser();

    const { data: campaignNotes } = useSWR(profile?.company_id ? 'notes' : null, (path) =>
        nextFetchWithQueries<CampaignNotesIndexGetQuery, CampaignNotesIndexGetResult>(path, {
            id: profile?.company_id ?? '',
        }),
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
                setLoading(false);
            } catch (error: any) {
                clientLogger(error, 'error');
                setLoading(false);
            }
        },
        [profile],
    );

    return {
        campaignNotes,
        loading,
        createNote,
    };
};
