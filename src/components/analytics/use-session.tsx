import type { Session } from '@supabase/auth-helpers-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useCallback, useEffect, useState } from 'react';

type useSessionParams = {
    onClear?: () => void;
    onReady?: (session: Session) => void;
    onUpdate?: (update: Session, current: Session) => void;
};

const clearSession = (onClear: useSessionParams['onClear']) => {
    if (onClear) onClear();
    return null;
};

const createSession = (session: Session, onReady: useSessionParams['onReady']) => {
    if (onReady) onReady(session);
    return session;
};

const updateSession = (update: Session, current: Session, onUpdate: useSessionParams['onUpdate']) => {
    if (onUpdate) onUpdate(update, current);

    // @ts-ignore session.user.session_id is not included in the User type
    if (current.user.session_id === update.user.session_id) return current;

    return update;
};

/**
 * "Safely" get the current Supabase session
 *
 * The current useSessionContext hook consistently updates the session object
 * (probably to expires_in key) which causes consistent rerenders when relying
 * on it as a dependency
 *
 * This hook will only return an updated session if:
 * - an empty session gets filled
 * - an existing session gets cleared
 * - an existing session gets replaced (based on session_id)
 */
export const useSession = (params?: useSessionParams) => {
    const { session: supabaseSession } = useSessionContext();

    const [session, setSession] = useState<Session | null>(null);

    const refreshSession = useCallback(() => {
        setSession(supabaseSession);
    }, [supabaseSession]);

    useEffect(() => {
        setSession((state) => {
            if (supabaseSession === null && state !== null) {
                return clearSession(params?.onClear);
            }

            if (supabaseSession !== null && state == null) {
                return createSession(supabaseSession, params?.onReady);
            }

            // @note contemplating whether allowing sessions to be replaced
            //       should consider this as a security risk
            if (supabaseSession !== null && state !== null) {
                return updateSession(supabaseSession, state, params?.onUpdate);
            }

            return state;
        });
    }, [supabaseSession, setSession, params]);

    return { session, refreshSession };
};
