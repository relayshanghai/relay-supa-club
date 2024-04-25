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
import { initSmartlook, useAnalytics, useSmartlook } from 'src/components/analytics/analytics-provider';
import { useMixpanel } from './use-mixpanel';
import type { SignupPostBody, SignupPostResponse } from 'pages/api/signup';
import awaitToError from 'src/utils/await-to-error';
import type { PaymentMethod } from 'types/stripe/setup-intent-failed-webhook';
import { appCacheDBKey } from 'src/constants';
import { useApiClient } from 'src/utils/api-client/request';

export type SignupData = {
    email: string;
    password: string;
    data: {
        first_name: string;
        last_name: string;
        phone?: string;
    };
};

export type ProfileWithCompany = ProfileDB;

export interface IUserContext {
    user: User | null;
    profile?: ProfileWithCompany;
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
    refreshProfile: KeyedMutator<ProfileWithCompany> | (() => void);
    supabaseClient: SupabaseClient<DatabaseWithCustomTypes> | null;
    getProfileController: MutableRefObject<AbortController | null | undefined>;
    signup: (body: SignupPostBody) => Promise<SignupPostResponse>;

    paymentMethods: Record<string, PaymentMethod>;
    refreshCustomerInfo: KeyedMutator<Record<string, PaymentMethod>> | (() => void);
}

export const userExists = async (email: string) => {
    const params = new URLSearchParams();
    params.append('email', email);
    const url = `profiles/exists?${params.toString()}`;
    try {
        const res = await nextFetch<{ message?: string; error?: string }>(url, {
            method: 'get',
        });
        if (res.error) {
            return {
                exists: true,
            };
        } else {
            return {
                exists: false,
            };
        }
    } catch (e) {
        if (e instanceof Error) {
            return {
                exists: true,
                mail: e.message,
            };
        }
    }
    return {
        exists: false,
        error: 'unknown error',
    };
};

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
    paymentMethods: {},
    refreshCustomerInfo: () => null,
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
    const { apiClient } = useApiClient();
    const { analytics } = useAnalytics();
    const { identify } = useSmartlook();

    useEffect(() => {
        initSmartlook();
    }, []);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);
    const { data: paymentMethods, mutate: refreshCustomerInfo } = useSWR('payment-methods', async () => {
        if (!session?.user?.id) return;
        const [error, data] = await awaitToError(nextFetch<PaymentMethod[]>(`profiles/payment-methods`));
        if (error) {
            clientLogger(error, 'error');
            return {};
        }
        const _paymentMethods: Record<string, PaymentMethod> = data?.reduce((acc, curr) => {
            acc[curr.type] = curr;
            return acc;
        }, {} as Record<string, PaymentMethod>);
        return _paymentMethods;
    });

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
                if (error?.message.includes('aborted')) {
                    return;
                }
                clientLogger(error, 'error');
                throw new Error(error.message || 'Unknown error');
            }
            identify(fetchedProfile.email || '');

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
                trackEvent('Log In', { email: email, $add: { total_sessions: 1 } });
                identify(data?.user?.email || '');
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
        [supabaseClient, trackEvent, identify],
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
            const id = session?.user?.id;
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
            indexedDB.deleteDatabase(appCacheDBKey(id));
            Sentry.setUser(null);
            if (redirect) {
                const redirectUrl = email ? `/login?${new URLSearchParams({ email })}` : '/login';
                window.stop(); // stop all network requests so that an inflight request does not reset the cookie
                window.location.href = redirectUrl;
            }
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const profileWithAdminOverrides: ProfileWithCompany | undefined = profile
        ? {
              ...profile,
              email_engine_account_id: clientRoleData.emailEngineAccountId || profile?.email_engine_account_id,
              sequence_send_email: clientRoleData.sequenceSendEmail || profile?.sequence_send_email,
          }
        : undefined;

    const signup = useCallback(
        async (body: SignupPostBody) => {
            const [err, result] = await awaitToError(apiClient.post<SignupPostResponse>(`/users`, body));
            if (err) {
                throw new Error(err.message);
            }
            refreshProfile();
            return result.data;
        },
        [apiClient, refreshProfile],
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
                paymentMethods: paymentMethods || {},
                refreshCustomerInfo,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
