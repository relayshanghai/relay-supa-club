import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Session, User } from '@supabase/supabase-js';

import type {
    CreateEmployeePostBody,
    CreateEmployeePostResponse,
} from 'pages/api/company/create-employee';
import type {
    ProfileGetQuery,
    ProfileGetResponse,
    ProfilePutBody,
    ProfilePutResponse,
} from 'pages/api/profiles';
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import useSWR from 'swr';

import type { ProfileDB } from 'src/utils/api/db/types';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import type { DatabaseWithCustomTypes } from 'types';
import { useRouter } from 'next/router';

export type SignupData = {
    email: string;
    password: string;
    data: {
        first_name: string;
        last_name: string;
    };
};

const ctx = createContext<{
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
    refreshProfile: () => void;
}>({
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
});

export const useUser = () => useContext(ctx);

export const UserProvider = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    const { isLoading, session } = useSessionContext();
    const supabaseClient = useSupabaseClient<DatabaseWithCustomTypes>();

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const { data: profile, mutate: refreshProfile } = useSWR(
        session?.user.id ? 'profiles' : null,
        (path) =>
            nextFetchWithQueries<ProfileGetQuery, ProfileGetResponse>(path, {
                id: session?.user.id ?? '',
            }),
    );

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
        const createEmployeeRes = await nextFetch<CreateEmployeePostResponse>(
            'company/create-employee',
            {
                method: 'POST',
                body,
            },
        );
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
        const email = session?.user?.email;
        await refreshProfile(undefined);
        await supabaseClient.auth.signOut();
        router.push(email ? `/logout/${encodeURIComponent(email)}` : '/logout');
    };

    return (
        <ctx.Provider
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
            }}
        >
            {children}
        </ctx.Provider>
    );
};
