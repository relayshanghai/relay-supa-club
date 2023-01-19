import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Session, User } from '@supabase/supabase-js';
import { ProfilePutResponse } from 'pages/api/profiles';
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';
import { ProfileDB, ProfileInsertDB } from 'src/utils/api/db/types';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import { Database } from 'types/supabase';

const ctx = createContext<{
    user: User | null;
    profile: ProfileDB | null;
    loading: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<{
        user: User | null;
        session: Session | null;
    }>;
    signup: (options: any) => Promise<{
        user: User | null;
        session: Session | null;
    }>;
    logout: () => void;
    upsertProfile: (updates: any) => void;
    refreshProfile: () => void;
}>({
    user: null,
    profile: null,
    loading: true,
    login: async () => ({
        user: null,
        session: null
    }),
    logout: () => null,
    signup: async () => ({
        user: null,
        session: null
    }),
    upsertProfile: () => null,
    refreshProfile: () => null
});

export const useUser = () => useContext(ctx);

export const UserProvider = ({ children }: PropsWithChildren) => {
    const [profile, setProfile] = useState<ProfileDB | null>(null);
    const { isLoading, session } = useSessionContext();
    const supabaseClient = useSupabaseClient<Database>();

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);
    const getProfile = useCallback(
        async function () {
            try {
                setLoading(true);

                const { data, error } = await supabaseClient
                    .from('profiles')
                    .select(`*`)
                    .eq('id', session?.user?.id)
                    .single();

                if (error) throw error;

                setProfile(data);
            } catch (error: any) {
                clientLogger(error, 'error');
            } finally {
                setLoading(false);
            }
        },
        [supabaseClient, session?.user?.id]
    );

    useEffect(() => {
        if (session?.user?.id) {
            getProfile();
        }
    }, [session, getProfile]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw new Error(error.message || 'Unknown error');
            return data;
        } catch (e: any) {
            clientLogger(e, 'error');
            setLoading(false);
            throw new Error(e.message || 'Unknown error');
        }
    };
    const signup = async (options: any) => {
        setLoading(true);
        try {
            const { error, data } = await supabaseClient.auth.signUp({
                email: options.email,
                password: options.password,
                options: {
                    data: options.data
                }
            });

            if (error) throw new Error(error?.message || 'Unknown error');
            return data;
        } catch (e: any) {
            throw new Error(e.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const upsertProfile = useCallback(
        async (body: Omit<ProfileInsertDB, 'id'>) => {
            setLoading(true);
            try {
                if (!session?.user?.id) throw new Error('User not found');
                return await nextFetch<ProfilePutResponse>('profiles', {
                    method: 'PUT',
                    body: { id: session.user?.id, ...body }
                });
            } catch (e: any) {
                throw new Error(e.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        },
        [session?.user]
    );
    const logout = async () => {
        await supabaseClient.auth.signOut();
        setProfile(null);
    };

    return (
        <ctx.Provider
            value={{
                user: session?.user || null,
                login,

                signup,
                loading,
                profile,
                upsertProfile,
                refreshProfile: getProfile,
                logout
            }}
        >
            {children}
        </ctx.Provider>
    );
};
