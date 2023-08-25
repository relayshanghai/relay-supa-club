import type { ApiResponse } from 'pages/api/notes/influencer/[id]';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { ProfileValue } from 'pages/api/sequence/influencers/[id]';
import type { NoteData } from 'src/components/influencer-profile/components/note';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { CampaignNotes } from 'src/utils/api/db';
import { formatDate } from 'src/utils/datetime';
import { isApiError } from 'src/utils/is-api-error';
import type { z } from 'zod';
import { useAsync } from './use-async';

export const useSequenceInfluencerNotes = () => {
    // @todo create a filter type for getNotes
    const getNotes = useAsync(async (sequence_influencer_id: string, filters?: any): Promise<NoteData[]> => {
        return await apiFetch<ApiResponse>('/api/notes/influencer/{id}', {
            path: { id: sequence_influencer_id },
            query: filters,
        }).then((res) => {
            // @note this should never happen unless aborted by signals
            //       we're just satisfying apiFetch
            if (res === undefined) throw new Error('Something went wrong');

            if (isApiError(res)) {
                throw new Error(res.error);
            }

            // @todo move this to api
            return res.map((note): NoteData => {
                return {
                    author: {
                        // @note profiles here is the manager
                        id: note.profiles ? note.profiles.id : '',
                        avatar:
                            note.profiles && note.profiles.avatar_url
                                ? note.profiles.avatar_url
                                : `https://api.dicebear.com/6.x/open-peeps/svg?seed=relay-manager-no-name@example.com&size=96`,
                        name: note.profiles ? `${note.profiles.first_name} ${note.profiles.last_name}` : 'No Name',
                    },
                    content: note.comment ?? '',
                    id: note.id,
                    created_at: note.created_at ? formatDate(note.created_at, '[date] [monthShort] [fullYear]') : '',
                    updated_at: note.created_at ? formatDate(note.created_at, '[date] [monthShort] [fullYear]') : '',
                };
            });
        });
    });

    const saveNote = useAsync(async (body: Omit<CampaignNotes['Insert'], 'user_id'>) => {
        return await apiFetch('/api/notes/influencer', { body });
    });

    const saveSequenceInfluencer = useAsync(
        async (sequence_influencer_id: string, body: z.input<typeof ProfileValue>) => {
            return await apiFetch<SequenceInfluencerManagerPage>('/api/sequence/influencers/{id}', {
                path: { id: sequence_influencer_id },
                body,
            }).then((res) => {
                // @note this should never happen unless aborted by signals
                //       we're just satisfying apiFetch
                if (res === undefined) throw new Error('Something went wrong');

                if (isApiError(res)) {
                    throw new Error(res.error);
                }

                return res;
            });
        },
    );

    return {
        getNotes,
        saveNote,
        saveSequenceInfluencer,
    };
};
