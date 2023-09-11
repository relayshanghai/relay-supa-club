import type {
    SaveSequenceInfluencerNotesRequest,
    SaveSequenceInfluencerNotesResponse,
} from 'pages/api/notes/influencer';
import type {
    GetSequenceInfluencerNotesRequest,
    GetSequenceInfluencerNotesResponse,
} from 'pages/api/notes/influencer/[id]';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { ProfileValue } from 'pages/api/sequence/influencers/[id]';
import type { NoteData } from 'src/components/influencer-profile/components/note';
import { apiFetch } from 'src/utils/api/api-fetch';
import { formatDate } from 'src/utils/datetime';
import { isApiError } from 'src/utils/is-api-error';
import type { z } from 'zod';
import { useAsync } from './use-async';

export const useSequenceInfluencerNotes = () => {
    // @todo create a filter type for getNotes
    const getNotes = useAsync(
        async (
            sequence_influencer_id: string,
            filters?: GetSequenceInfluencerNotesRequest['query'],
        ): Promise<NoteData[]> => {
            return await apiFetch<GetSequenceInfluencerNotesResponse, GetSequenceInfluencerNotesRequest>(
                '/api/notes/influencer/{id}',
                {
                    path: { id: sequence_influencer_id },
                    query: filters ?? {},
                },
            ).then((res) => {
                if (isApiError(res.content)) {
                    throw new Error(res.content.error);
                }

                // @todo move this to api
                return res.content
                    .filter((note) => note.profiles !== null)
                    .map((note): NoteData => {
                        if (note.profiles === null) {
                            // @ts-ignore this should not happen, but Array.filter does not work so let's just make TS happy
                            return null;
                        }

                        return {
                            author: {
                                // @note profiles here is the manager
                                id: note.profiles ? note.profiles.id : '',
                                avatar:
                                    note.profiles && note.profiles.avatar_url
                                        ? note.profiles.avatar_url
                                        : `https://api.dicebear.com/6.x/open-peeps/svg?seed=relay-manager-no-name@example.com&size=96`,
                                name: note.profiles
                                    ? `${note.profiles.first_name} ${note.profiles.last_name}`
                                    : 'No Name',
                            },
                            content: note.comment ?? '',
                            id: note.id,
                            created_at: note.created_at
                                ? formatDate(note.created_at, '[date] [monthShort] [fullYear]')
                                : '',
                            updated_at: note.created_at
                                ? formatDate(note.created_at, '[date] [monthShort] [fullYear]')
                                : '',
                        };
                    });
            });
        },
    );

    const saveNote = useAsync(async (body: SaveSequenceInfluencerNotesRequest['body']) => {
        await apiFetch<SaveSequenceInfluencerNotesResponse, SaveSequenceInfluencerNotesRequest>(
            '/api/notes/influencer',
            { body },
        );
    });

    const saveSequenceInfluencer = useAsync(
        async (sequence_influencer_id: string, body: z.input<typeof ProfileValue>) => {
            return await apiFetch<SequenceInfluencerManagerPage>('/api/sequence/influencers/{id}', {
                path: { id: sequence_influencer_id },
                body,
            }).then((res) => {
                if (isApiError(res.content)) {
                    throw new Error(res.content.error);
                }

                return res.content;
            });
        },
    );

    return {
        getNotes,
        saveNote,
        saveSequenceInfluencer,
    };
};
