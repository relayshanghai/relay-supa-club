import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { useUser } from './use-user';
import { clientLogger } from 'src/utils/logger';
import { nextFetch } from 'src/utils/fetcher';
import { CampaignNotePostBody, CampaignNotePostResponse } from 'pages/api/notes/create';
import { CampaignNotesIndexGetResult } from 'pages/api/notes';

export const useNotes = ({ campaignCreatorId }: { campaignCreatorId?: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { profile } = useUser();

    const { data: campaignNotes } = useSWR('notes', (path) =>
        nextFetch<CampaignNotesIndexGetResult>(path, { method: 'get' }),
    );
    //eslint-disable-next-line
    console.log({ campaignCreatorId, campaignNotes });

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
