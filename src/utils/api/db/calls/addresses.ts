import type { Addresses, RelayDatabase } from '../types';

export const getAddressByInfluencer = (db: RelayDatabase) => async (id: string) => {
    const { data, error } = await db.from('addresses').select().eq('influencer_social_profile_id', id).maybeSingle();

    if (error) throw error;

    return data;
};

export const saveAddressByInfluencer = (db: RelayDatabase) => async (id: string, payload: Addresses['Insert']) => {
    const { data, error } = await db
        .from('addresses')
        .upsert(payload)
        .eq('influencer_social_profile_id', id)
        .select()
        .single();

    if (error) throw error;

    return data;
};
