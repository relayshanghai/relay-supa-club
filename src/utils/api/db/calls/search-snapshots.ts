import type { RelayDatabase, SearchSnapshots } from '../types';

export const insertSearchSnapshot = (db: RelayDatabase) => async (data: SearchSnapshots['Insert']) => {
    const result = await db.from('search_snapshots').insert(data).select().single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const updateSearchSnapshot = (db: RelayDatabase) => async (data: SearchSnapshots['Update'], id: string) => {
    const result = await db.from('search_snapshots').update(data).eq('id', id).select().single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const getSearchSnapshot = (db: RelayDatabase) => async (id: string) => {
    const result = await db.from('search_snapshots').select().eq('id', id).maybeSingle();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};
