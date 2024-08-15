'use client';

import { useSessionContext } from '@supabase/auth-helpers-react';
import type { User } from '@supabase/supabase-js';

import type { ProfilePutBody, ProfilePutResponse } from 'pages/api/profiles';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import type { ProfileDB } from 'src/utils/api/db/types';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import { useClientDb } from 'src/utils/client-db/use-client-db';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { useAtomValue } from 'jotai';
import { initSmartlook, useSmartlook } from 'src/components/analytics/analytics-provider';

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

export const UserContextV2 = createContext<IUserContext>({
    user: null,
    profile: undefined,
    loading: true,
});

export const useUserV2 = () => {
    const context = useContext(UserContextV2);
    if (context === null) {
        throw new Error('useUser must be used within a UserProviderV2');
    }
    return context;
};

export const UserProviderV2 = ({ children }: PropsWithChildren) => {
    const { isLoading, session } = useSessionContext();
    const { getProfileById } = useClientDb();
    const getProfileController = useRef<AbortController | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const clientRoleData = useAtomValue(clientRoleAtom);
    const { identify } = useSmartlook();

    useEffect(() => {
        initSmartlook();
    }, []);

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

    useEffect(() => {
        // detect if the email has been changed on the supabase side and update the profile
        (async () => {
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
        })();
    }, [session?.user.email, profile?.email, updateProfile, profile, session, refreshProfile]);

    const profileWithAdminOverrides: ProfileWithCompany | undefined = profile
        ? {
              ...profile,
              email_engine_account_id: clientRoleData.emailEngineAccountId || profile?.email_engine_account_id,
              sequence_send_email: clientRoleData.sequenceSendEmail || profile?.sequence_send_email,
          }
        : undefined;

    return (
        <UserContextV2.Provider
            value={{
                user: session?.user || null,
                loading,
                profile: profileWithAdminOverrides,
            }}
        >
            {children}
        </UserContextV2.Provider>
    );
};
