import type { RelayDatabase, CampaignNotes } from '../types';

export const getNotesBySequenceInfluencer =
    (db: RelayDatabase) => async (sequence_influencer_id: string, filter: { user_id?: string }) => {
        let query = db
            .from('campaign_notes')
            .select('*, profiles(id, first_name, last_name, avatar_url)')
            .eq('sequence_influencer_id', sequence_influencer_id);

        if (filter.user_id) {
            query = query.eq('user_id', filter.user_id);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data;
    };

export const saveNotesBySequenceInfluencer = (db: RelayDatabase) => async (payload: CampaignNotes['Insert']) => {
    const note =
        payload.sequence_influencer_id && payload.user_id
            ? await getNotesBySequenceInfluencer(db)(payload.sequence_influencer_id, { user_id: payload.user_id })
            : null;

    if (note && note.length > 0 && note[0].user_id !== payload.user_id) {
        throw new Error('Cannot create sequence influencer note');
    }

    const upsertPayload = note && note.length > 0 ? { ...payload, id: note[0].id } : { ...payload };

    const { data, error } = await db.from('campaign_notes').upsert(upsertPayload).select().single();
    if (error) throw error;

    return data;
};
