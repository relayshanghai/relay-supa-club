import type { AuthUser, RelayDatabase, TrackingEvents } from '../types';

export const insertTrackingEvent = (db: RelayDatabase) => async (data: TrackingEvents['Insert']) => {
    const result = await db.from('tracking_events').insert(data).select().single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const getTrackingEvent = (db: RelayDatabase) => async (id: string) => {
    const result = await db.from('tracking_events').select().eq('id', id).maybeSingle();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};

export const getProfileByUser = (db: RelayDatabase) => async (user: AuthUser) => {
    const result = await db.from('profiles').select().eq('id', user.id).single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
};
