import { apiFetch } from 'src/utils/api/api-fetch';
import { useAsync } from './use-async';
import type { CampaignNotes } from 'src/utils/api/db';

export const useSequenceInfluencerNotes = () => {
    // @todo create a filter type for getNotes
    const getNotes = useAsync(async (sequence_influencer_id: string, filters?: any) => {
        return await apiFetch('/api/notes/influencer/{id}', {
            path: { id: sequence_influencer_id },
            query: filters,
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
