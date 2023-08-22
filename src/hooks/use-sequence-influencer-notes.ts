import { apiFetch } from 'src/utils/api/api-fetch';
import { useAsync } from './use-async';
import type { CampaignNotes } from 'src/utils/api/db';
import type { NoteData } from 'src/components/influencer-profile/components/note';
import { formatDate } from 'src/utils/datetime';

export const useSequenceInfluencerNotes = () => {
    // @todo create a filter type for getNotes
    const getNotes = useAsync(async (sequence_influencer_id: string, filters?: any): Promise<NoteData[]> => {
        return await apiFetch('/api/notes/influencer/{id}', {
            path: { id: sequence_influencer_id },
            query: filters,
        }).then((res) => {
            // @todo move this to api
            return res.map((note: any): NoteData => {
                return {
                    author: {
                        id: note.profiles.id,
                        avatar: `https://api.dicebear.com/6.x/open-peeps/svg?seed=${note.profiles.id}@example.com&size=96`,
                        name: `${note.profiles.first_name} ${note.profiles.last_name}`,
                    },
                    content: note.comment,
                    id: note.id,
                    created_at: formatDate(note.created_at, '[date] [monthShort] [fullYear]'),
                    updated_at: formatDate(note.created_at, '[date] [monthShort] [fullYear]'),
                };
            });
        });
    });

    const saveNote = useAsync(async (body: Omit<CampaignNotes['Insert'], 'user_id'>) => {
        await apiFetch('/api/notes/influencer', { body });
    });

    return {
        getNotes,
        saveNote,
    };
};
