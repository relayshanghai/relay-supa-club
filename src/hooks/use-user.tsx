import { Session, User } from '@supabase/supabase-js';
import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { supabase } from 'src/utils/supabase-client';
import { ProfileDB } from 'types';

const ctx = createContext<{
    user: User | null;
    session: Session | null;
    profile: ProfileDB | null;
    loading: boolean;
    login: (email: string, password: string) => void;
    signup: (options: any) => void;
    logout: () => void;
    updateProfile: (updates: any) => void;
    refreshProfile: () => void;
}>({
    user: null,
    session: null,
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
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileDB | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setSession(supabase.auth.session());
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        setLoading(false);
    }, []);

    const getProfile = useCallback(
        async function () {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error('User not found');

                setUser(user);

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`*, company:companies(id, name, website)`)
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setProfile(data);
            } catch (error: any) {
                // eslint-disable-next-line no-console
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setUser, setProfile]
    );

    useEffect(() => {
        if (session) {
            getProfile();
        }
    }, [session, getProfile]);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const { user, error } = await supabase.auth.signIn({
                email,
                password
            });

            if (error) {
                throw error;
            }

            // Fetch the profile for the app to fill it
            setUser(user);

            await getProfile();
        } catch (e: any) {
            throw new Error(e.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signup = useCallback(async (options: any) => {
        setLoading(true);
        try {
            const { user, error } = await supabase.auth.signUp(
                {
                    email: options.email,
                    password: options.password
                },
                {
                    data: options.data
                }
            );

            if (error) {
                throw error;
            }

            // Fetch the profile for the app to fill it
            setUser(user);
        } catch (e: any) {
            throw new Error(e.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateProfile = useCallback(async (input: any) => {
        setLoading(true);
        try {
            const user = supabase.auth.user();
            if (!user) throw new Error('User not found');
            const updates = {
                id: user.id,
                updated_at: new Date(),
                ...input
            };
            const { error, data } = await supabase.from('profiles').upsert(updates).single();

            if (error) {
                throw error;
            }

            // Fetch the profile for the app to fill it
            setProfile(data);
        } catch (e: any) {
            throw new Error(e.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const value = useMemo(
        () => ({
            user,
            session,
            login,
            logout,
            signup,
            loading,
            profile,
            updateProfile,
            refreshProfile: getProfile
        }),
        [user, session, loading, profile, login, signup, logout, updateProfile, getProfile]
    );

    return <ctx.Provider value={value}>{children}</ctx.Provider>;
};
