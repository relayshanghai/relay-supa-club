import type { AuthUser } from '@supabase/supabase-js';
import type { RelayDatabase, TrackingEvents } from '../types';

export const insertTrackingEvent = (db: RelayDatabase) => async (data: TrackingEvents['Insert']) => {
    const {
        id,
        created_at,
        user_id,
        profile_id,
        company_id,
        anonymous_id,
        session_id,
        journey_id,
        journey_type,
        event,
        data: _data,
        event_at,
    } = data;
    const result = await db
        .from('tracking_events')
        .upsert(
            {
                id,
                created_at,
                user_id,
                profile_id,
                company_id,
                anonymous_id,
                session_id,
                journey_id,
                journey_type,
                event,
                data: _data,
                event_at,
            },
            {
                ignoreDuplicates: true,
            },
        )
        .select()
        .single();

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
