import { useSessionContext } from '@supabase/auth-helpers-react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import * as Sentry from '@sentry/browser';
import { useRudder, useRudderstack } from 'src/hooks/use-rudderstack';
import type { CreateEmployeePostBody, CreateEmployeePostResponse } from 'pages/api/company/create-employee';
import type { ProfileInsertBody, ProfilePutBody, ProfilePutResponse } from 'pages/api/profiles';
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
import { useRouter } from 'next/router';
import { useAnalytics } from 'src/components/analytics/analytics-provider';
import { useMixpanel } from './use-mixpanel';

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
    signup: (options: SignupData) => Promise<{
        user: User | null;
        session: Session | null;
    }>;
    createEmployee: (email: string) => Promise<CreateEmployeePostResponse | null>;
    logout: () => void;
    updateProfile: (updates: Omit<ProfilePutBody, 'id'>) => void;
    refreshProfile: KeyedMutator<ProfileDB> | (() => void);
    supabaseClient: SupabaseClient<DatabaseWithCustomTypes> | null;
    getProfileController: MutableRefObject<AbortController | null | undefined>;
}

export const UserContext = createContext<IUserContext>({
    user: null,
    profile: undefined,
    loading: true,
    login: async () => ({
        user: null,
        session: null,
    }),
    createEmployee: async () => null,
    logout: () => null,
    signup: async () => ({
        user: null,
        session: null,
    }),
    updateProfile: () => null,
    refreshProfile: () => null,
    supabaseClient: null,
    getProfileController: { current: null },
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
    const rudder = useRudder();
    const mixpanel = useMixpanel();
    const { analytics } = useAnalytics();
    const router = useRouter();

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

    const signup = useCallback(
        async ({ email, password, data }: SignupData) => {
            if (session?.user) {
                const { error: signOutError } = await supabaseClient.auth.signOut();
                if (signOutError) {
                    throw new Error(signOutError?.message || 'Error signing out previous session');
                }
            }

            // @note This needs `Confirm Email` and `Secure Email Change` settings disabled
            // These are found under your Supabase Project > Authentication > Providers > Email
            // With those enabled, signing up will not automatically create a new session (since it needs confirmation)
            const { error, data: signupResData } = await supabaseClient.auth.signUp({
                email,
                password,
            });

            if (error) {
                throw new Error(error?.message || 'Unknown error');
            }
            const id = signupResData?.user?.id;
            if (!id) {
                throw new Error('Error creating profile, no id in response');
            }
            const profileBody: ProfileInsertBody = {
                id,
                email,
                ...data,
            };
            const createProfileResponse = await nextFetch<ProfileInsertBody>('profiles', {
                method: 'POST',
                body: profileBody,
            });

            if (!createProfileResponse.id) {
                clientLogger(createProfileResponse, 'error');
                throw new Error('Error creating profile');
            }

            return signupResData;
        },
        [session?.user, supabaseClient],
    );

    const createEmployee = useCallback(async (email: string) => {
        const body: CreateEmployeePostBody = { email };
        const createEmployeeRes = await nextFetch<CreateEmployeePostResponse>('company/create-employee', {
            method: 'POST',
            body,
        });
        if (!createEmployeeRes.id) {
            throw new Error('Error creating employee');
        }
        return createEmployeeRes;
    }, []);

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

    const logout = useCallback(async () => {
        if (!supabaseClient || !rudder) {
            clientLogger('User cannot logout', 'error', true);
            return;
        }

        const email = session?.user?.email;
        await trackEvent('Logout', { email });
        // destroy the session first
        await supabaseClient.auth.signOut();

        // reset all analytics
        try {
            rudder.reset(true);
            await analytics.reset();
            // @note if window.mixpanel does not exist, there is probably nothing to reset
            if (mixpanel) mixpanel.reset();
        } catch (error: unknown) {
            clientLogger(error, 'error', true);
        }

        // @todo deleting idb is blocked so we do not wait to allow us to continue
        Sentry.setUser(null);

        const redirectUrl = email ? `/login?${new URLSearchParams({ email })}` : '/login';
        await router.replace(redirectUrl);
    }, [analytics, rudder, mixpanel, router, supabaseClient, trackEvent, session]);

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

    return (
        <UserContext.Provider
            value={{
                user: session?.user || null,
                login,
                createEmployee,
                signup,
                loading,
                profile: profileWithAdminOverrides,
                updateProfile,
                refreshProfile,
                logout,
                supabaseClient,
                getProfileController,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
