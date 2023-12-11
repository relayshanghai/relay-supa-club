import { useSessionContext } from '@supabase/auth-helpers-react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import * as Sentry from '@sentry/browser';
import { useRudderstack } from 'src/hooks/use-rudderstack';

import type { ProfilePutBody, ProfilePutResponse } from 'pages/api/profiles';
import type { MutableRefObject, PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { KeyedMutator } from 'swr';
import useSWR from 'swr';

import type { ProfileDB } from 'src/utils/api/db/types';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { DatabaseWithCustomTypes } from 'types';
import { useClientDb } from 'src/utils/client-db/use-client-db';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { useAtomValue } from 'jotai';
import { useAnalytics } from 'src/components/analytics/analytics-provider';
import { useMixpanel } from './use-mixpanel';
import type { SignupPostBody, SignupPostResponse } from 'pages/api/signup';

export type SignupData = {
    email: string;
    password: string;
    data: {
        first_name: string;
        last_name: string;
        phone?: string;
    };
};

export interface IUserContext {
    user: User | null;
    profile: ProfileDB | undefined;
    loading: boolean;
    login: (
        email: string,
        password: string,
    ) => Promise<{
        user: User | null;
        session: Session | null;
    }>;
    logout: (redirect?: boolean) => void;
    updateProfile: (updates: Omit<ProfilePutBody, 'id'>) => void;
    refreshProfile: KeyedMutator<ProfileDB> | (() => void);
    supabaseClient: SupabaseClient<DatabaseWithCustomTypes> | null;
    getProfileController: MutableRefObject<AbortController | null | undefined>;
    signup: (body: SignupPostBody) => Promise<SignupPostResponse>;
}

export const UserContext = createContext<IUserContext>({
    user: null,
    profile: undefined,
    loading: true,
    login: async () => ({
        user: null,
        session: null,
    }),
    logout: () => null,
    updateProfile: () => null,
    refreshProfile: () => null,
    supabaseClient: null,
    getProfileController: { current: null },
    signup: async () => undefined as any,
});

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
    const { isLoading, session } = useSessionContext();
    const { supabaseClient, getProfileById } = useClientDb();
    const getProfileController = useRef<AbortController | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const { trackEvent } = useRudderstack();
    const clientRoleData = useAtomValue(clientRoleAtom);
    const mixpanel = useMixpanel();
    const { analytics } = useAnalytics();

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const { data: profile, mutate: refreshProfile } = useSWR(
        session?.user.id ? [session.user.id, 'profiles'] : null,
        async ([userId]) => {
            if (getProfileController.current) {
                getProfileController.current.abort();
            }
            const controller = new AbortController();
            getProfileController.current = controller;

            const { data: fetchedProfile, error } = await getProfileById(userId, getProfileController.current?.signal);
            if (error) {
                clientLogger(error, 'error');
                throw new Error(error.message || 'Unknown error');
            }
            return fetchedProfile;
        },
    );

    const login = useCallback(
        async (email: string, password: string) => {
            setLoading(true);
            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw new Error(error.message || 'Unknown error');
                trackEvent('Log In', { email: email, total_sessions: 1 });
                return data;
            } catch (e: unknown) {
                clientLogger(e, 'error');
                let message = 'Unknown error';
                if (e instanceof Error) message = e.message ?? 'Unknown error';
                throw new Error(message);
            } finally {
                setLoading(false);
            }
        },
        [supabaseClient, trackEvent],
    );

    const updateProfile = useCallback(
        async (updateData: Omit<ProfilePutBody, 'id'>) => {
            setLoading(true);
            try {
                if (!session?.user?.id) throw new Error('User not found');
                const body: ProfilePutBody = { ...updateData, id: session.user.id };
                return await nextFetch<ProfilePutResponse>('profiles', {
                    method: 'PUT',
                    body,
                });
            } catch (e: unknown) {
                clientLogger(e, 'error');
                let message = 'Unknown error';
                if (e instanceof Error) message = e.message ?? 'Unknown error';
                throw new Error(message);
            } finally {
                setLoading(false);
            }
        },
        [session?.user],
    );

    const logout = useCallback(
        async (redirect = true) => {
            refreshProfile(undefined, { revalidate: false }); // reset the profile to undefined
            if (!supabaseClient) {
                clientLogger('User cannot logout', 'error', true);
                return;
            }

            const email = session?.user?.email;
            await trackEvent('Logout', { email });
            // destroy the session first
            await supabaseClient.auth.signOut();

            // reset all analytics
            try {
                if (mixpanel && mixpanel.reset) {
                    mixpanel.reset(true);
                }
                if (analytics && analytics.reset) {
                    await analytics.reset();
                }
            } catch (error: unknown) {
                clientLogger(error, 'error', true);
            }

            Sentry.setUser(null);
            if (redirect) {
                const redirectUrl = email ? `/login?${new URLSearchParams({ email })}` : '/login';
                window.stop(); // stop all network requests so that an inflight request does not reset the cookie
                window.location.href = redirectUrl;
            }
        },
        [refreshProfile, supabaseClient, session?.user?.email, trackEvent, mixpanel, analytics],
    );

    useEffect(() => {
        // detect if the email has been changed on the supabase side and update the profile
        const updateEmail = async () => {
            // This situation might happen between the time the user is logged in and the profile is fetched, or if the user logs in with a different email
            if (session?.user.id !== profile?.id) {
                return refreshProfile();
            }
            // only proceed if the ids match and the emails are different
            if (session?.user.email && profile?.email && session.user.email !== profile.email) {
                try {
                    await updateProfile({ email: session.user.email });
                    refreshProfile();
                } catch (error) {
                    clientLogger(error, 'error');
                }
            }
        };
        updateEmail();
    }, [session?.user.email, profile?.email, updateProfile, profile, session, refreshProfile]);

    const profileWithAdminOverrides: ProfileDB | undefined = profile
        ? {
              ...profile,
              email_engine_account_id: clientRoleData.emailEngineAccountId || profile?.email_engine_account_id,
              sequence_send_email: clientRoleData.sequenceSendEmail || profile?.sequence_send_email,
          }
        : undefined;

    const signup = useCallback(
        async (body: SignupPostBody) => {
            const res = await nextFetch<SignupPostResponse>(`signup`, {
                method: 'POST',
                body,
            });
            refreshProfile();
            return res;
        },
        [refreshProfile],
    );

    return (
        <UserContext.Provider
            value={{
                user: session?.user || null,
                login,
                loading,
                profile: profileWithAdminOverrides,
                updateProfile,
                refreshProfile,
                logout,
                signup,
                supabaseClient,
                getProfileController,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
