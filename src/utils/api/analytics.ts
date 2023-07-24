import type { SupabaseClient } from '@supabase/supabase-js';
import { getProfileByUser } from './db/calls/tracking_events';

type SessionIds = {
    session_id?: string;
    user_id?: string;
    profile_id?: string;
    company_id?: string | null;
};

export const getUserSession = (db: SupabaseClient) => async () => {
    const {
        data: { session },
        error: _error_session,
    } = await db.auth.getSession();

    const data: SessionIds = {};

    if (session !== null) {
        const profile = await getProfileByUser(db)(session.user);

        // @ts-ignore session.user.session_id is not included in the User type
        data.session_id = session.user.session_id;
        data.user_id = session.user.id;
        // @todo profile.id is user.id
        data.profile_id = profile.id;
        data.company_id = profile.company_id;
    }

    return data;
};
