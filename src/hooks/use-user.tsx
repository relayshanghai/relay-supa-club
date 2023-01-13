import {
    useSessionContext,
    useSupabaseClient,
    useUser as supabaseUseUser
} from '@supabase/auth-helpers-react';
import { User } from '@supabase/supabase-js';
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { ProfileDB } from 'src/utils/api/db/types';
import { clientLogger } from 'src/utils/logger';
import { Database } from 'types/supabase';

const ctx = createContext<{
    user: User | null;
    profile: ProfileDB | null;
    loading: boolean;
    login: (email: string, password: string) => void;
    signup: (options: any) => void;
    logout: () => void;
    updateProfile: (updates: any) => void;
    refreshProfile: () => void;
}>({
    user: null,
    profile: null,
    loading: true,
    login: () => null,
    logout: () => null,
    signup: () => null,
    updateProfile: () => null,
    refreshProfile: () => null
});

export const useUser = () => useContext(ctx);

export const UserProvider = ({ children }: PropsWithChildren) => {
    const [profile, setProfile] = useState<ProfileDB | null>(null);
    const { isLoading } = useSessionContext();
    const user = supabaseUseUser();
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
                    .select(`*, company:companies(id, name, website)`)
                    .eq('id', user?.id)
                    .single();

                if (error) throw error;

                setProfile(data);
            } catch (error: any) {
                clientLogger(error, 'error');
            } finally {
                setLoading(false);
            }
        },
        [supabaseClient, user?.id]
    );

    useEffect(() => {
        if (user?.id) {
            getProfile();
        }
    }, [user, getProfile]);

    const login = useCallback(
        async (email: string, password: string) => {
            setLoading(true);
            try {
                const { error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw new Error(error.message || 'Unknown error');
            } catch (e: any) {
                clientLogger(e, 'error');
                setLoading(false);
                throw new Error(e.message || 'Unknown error');
            }
        },
        [supabaseClient.auth]
    );

    const signup = useCallback(
        async (options: any) => {
            setLoading(true);
            try {
                const { error } = await supabaseClient.auth.signUp({
                    email: options.email,
                    password: options.password,
                    options: {
                        data: options.data
                    }
                });

                if (error) throw error;
            } catch (e: any) {
                setLoading(false);
                throw new Error(e.message || 'Unknown error');
            }
        },
        [supabaseClient.auth]
    );

    // TODO: this should be moved to the backend
    const updateProfile = useCallback(
        async (input: any) => {
            setLoading(true);
            try {
                const {
                    data: { user }
                } = await supabaseClient.auth.getUser();
                if (!user) throw new Error('User not found');
                const updates = {
                    id: user.id,
                    updated_at: new Date(),
                    ...input
                };
                const { error } = await supabaseClient.from('profiles').upsert(updates).single();

                if (error) throw error;
            } catch (e: any) {
                throw new Error(e.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        },
        [supabaseClient]
    );

    const logout = useCallback(async () => {
        await supabaseClient.auth.signOut();
    }, [supabaseClient.auth]);

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            signup,
            loading,
            profile,
            updateProfile,
            refreshProfile: getProfile
        }),
        [user, loading, profile, login, signup, logout, updateProfile, getProfile]
    );

    return <ctx.Provider value={value}>{children}</ctx.Provider>;
};
