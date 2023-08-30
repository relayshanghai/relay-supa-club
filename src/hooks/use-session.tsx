import type { Session } from '@supabase/auth-helpers-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CompanyTable, ProfilesTable } from 'src/utils/api/db/types';
import type { DatabaseWithCustomTypes } from 'types';

type useSessionParams = {
    onClear?: () => void;
    onReady?: (session: Session | null) => void;
    onUpdate?: (update: Session | null, current: Session | null) => void;
};

const clearSession = (onClear: useSessionParams['onClear']) => {
    if (onClear) onClear();
    return null;
};

const createSession = (session: Session | null, onReady: useSessionParams['onReady']) => {
    if (onReady) onReady(session);
    return session;
};

const updateSession = (update: Session | null, current: Session | null, onUpdate: useSessionParams['onUpdate']) => {
    if (onUpdate) onUpdate(update, current);

    if (!current || !update) return current;

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
    const { session: supabaseSession, supabaseClient } = useSessionContext();
    const control = useRef<AbortController>(new AbortController())

    const [session, setSession] = useState<Session | null>(supabaseSession);
    const [profile, setProfile] = useState<ProfilesTable['Row'] | null>(null);
    const [company, setCompany] = useState<CompanyTable['Row'] | null>(null);

    const getProfile = useCallback(async (session: Session | null) => {
        if (session === null) return null;

        const { data, error } = await supabaseClient
            .from<"profiles", DatabaseWithCustomTypes["public"]["Tables"]["profiles"]>('profiles')
            .select()
            .abortSignal(control.current.signal)
            .eq('id', session.user.id)
            .maybeSingle();

        if (error && error.code === '20') {
            return null;
        }

        if (error) {
            throw error;
        }

        return data
    }, [supabaseClient])

    const getCompany = useCallback(async (companyId: string | null) => {
        if (companyId === null) return null;

        const { data, error } = await supabaseClient
            .from<"companies", DatabaseWithCustomTypes["public"]["Tables"]["companies"]>('companies')
            .select()
            .abortSignal(control.current.signal)
            .eq('id', companyId)
            .maybeSingle();

        if (error && error.code === '20') {
            return null;
        }

        if (error) {
            throw error;
        }

        return data
    }, [supabaseClient])

    const refreshSession = useCallback(() => {
        setSession(supabaseSession);
    }, [supabaseSession]);

    useEffect(() => {
        const cleanup = () => {
            control.current.abort()
            control.current = new AbortController();
        }

        // @ts-ignore session.user.session_id is not included in the User type
        if (supabaseSession && session && supabaseSession.user.session_id === session.user.session_id) return;

        // only refetch profile when session really changes
        if (supabaseSession && profile && supabaseSession.user.id === profile.id) {
            return cleanup;
        }

        getProfile(supabaseSession).then(async (loadedProfile) => {
            const company = loadedProfile ? await getCompany(loadedProfile.company_id) : null;

            if (loadedProfile && company) {
                setCompany((s) => {
                    return (company && s?.id !== company.id) ? company : s;
                })

                setProfile((s) => {
                    return (loadedProfile && s?.id !== loadedProfile.id) ? loadedProfile : s;
                });
            }

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

            if (supabaseSession === null) {
                setProfile((s) => s !== null ? null : s)
                setCompany((s) => s !== null ? null : s)
            }
        });

        return cleanup
    }, [supabaseSession, session, profile, getProfile, getCompany, params]);

    return { session, profile, company, refreshSession };
};
