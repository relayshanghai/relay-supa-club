import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import * as Sentry from '@sentry/browser';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { CreateEmployeePostBody, CreateEmployeePostResponse } from 'pages/api/company/create-employee';
import type { ProfileGetQuery, ProfileGetResponse, ProfilePutBody, ProfilePutResponse } from 'pages/api/profiles';
import type { MutableRefObject, PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { KeyedMutator } from 'swr';
import useSWR from 'swr';

import type { ProfileDB } from 'src/utils/api/db/types';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { DatabaseWithCustomTypes } from 'types';

export type SignupData = {
    email: string;
    password: string;
    data: {
        first_name: string;
        last_name: string;
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
    refreshProfile: KeyedMutator<ProfileGetResponse> | (() => void);
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
    const supabaseClient = useSupabaseClient<DatabaseWithCustomTypes>();
    const getProfileController = useRef<AbortController | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const { identifyUser } = useRudderstack();
    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const { data: profile, mutate: refreshProfile } = useSWR(session?.user.id ? 'profiles' : null, async (path) => {
        if (getProfileController.current) {
            getProfileController.current.abort();
        }
        const controller = new AbortController();
        getProfileController.current = controller;

        const fetchedProfile = await nextFetchWithQueries<ProfileGetQuery, ProfileGetResponse>(
            path,
            {
                id: session?.user.id ?? '',
            },
            { signal: controller.signal },
        );

        // only set Sentry user if it is the first time we are fetching the profile
        if (fetchedProfile?.email && !profile?.email) {
            Sentry.setUser({
                email: fetchedProfile.email,
                id: fetchedProfile.id,
                name: `${fetchedProfile.first_name} ${fetchedProfile.last_name}`,
            });
        }
        return fetchedProfile;
    });

    // identify user with RudderStack on profile change
    useEffect(() => {
        if (profile?.id) {
            identifyUser(profile.id, {
                name: `${profile.first_name} ${profile.last_name}`,
                firstName: `${profile.first_name}`,
                lastName: `${profile.last_name}`,
                email: `${profile.email}`,
                company: { id: `${profile.company_id}` },
            });
        }
    }, [identifyUser, profile]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw new Error(error.message || 'Unknown error');
            return data;
        } catch (e: unknown) {
            clientLogger(e, 'error');
            let message = 'Unknown error';
            if (e instanceof Error) message = e.message ?? 'Unknown error';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const signup = async ({ email, password, data }: SignupData) => {
        if (session?.user) {
            const { error: signOutError } = await supabaseClient.auth.signOut();
            if (signOutError) {
                throw new Error(signOutError?.message || 'Error signing out previous session');
            }
        }
        const { error, data: signupResData } = await supabaseClient.auth.signUp({
            email,
            password,
            options: { data },
        });

        if (error) {
            throw new Error(error?.message || 'Unknown error');
        }

        return signupResData;
    };

    const createEmployee = async (email: string) => {
        const body: CreateEmployeePostBody = { email };
        const createEmployeeRes = await nextFetch<CreateEmployeePostResponse>('company/create-employee', {
            method: 'POST',
            body,
        });
        if (!createEmployeeRes.id) {
            throw new Error('Error creating employee');
        }
        return createEmployeeRes;
    };

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
    const logout = async () => {
        Sentry.setUser(null);
        const email = session?.user?.email;
        // cannot use router.push() here because it won't cancel in-flight requests which wil re-set the cookie

        window.location.href = email ? `/logout?${new URLSearchParams({ email })}` : '/logout';
    };

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

    return (
        <UserContext.Provider
            value={{
                user: session?.user || null,
                login,
                createEmployee,
                signup,
                loading,
                profile,
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
