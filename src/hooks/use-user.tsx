import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from 'src/utils/supabase-client';

const ctx = createContext<{
    user: undefined | { email: string; [key: string]: any };
    session: any;
    profile: any;
    loading: boolean;
    login: (email: string, password: string) => void;
    signup: (options: any) => void;
    logout: () => void;
    updateProfile: (updates: any) => void;
    refreshProfile: () => void;
}>({
    user: undefined,
    session: undefined,
    profile: undefined,
    loading: true,
    login: () => null,
    logout: () => null,
    signup: () => null,
    updateProfile: () => null,
    refreshProfile: () => null
});

export const useUser = () => useContext(ctx);

export const UserProvider: React.FC<{ children: any }> = ({ children }) => {
    const [user, setUser] = useState<any>();
    const [profile, setProfile] = useState<any>({});
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setSession(supabase.auth.session());
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        setLoading(false);
    }, []);

    async function getProfile() {
        try {
            setLoading(true);
            const user = supabase.auth.user();
            setUser(user);

            const { data, error } = await supabase
                .from('profiles')
                .select(`*, company:companies(id, name, website)`)
                .eq('id', user!.id)
                .single();

            if (error) {
                throw error;
            }
            setProfile(data);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session) {
            getProfile();
        }
    }, [session]);

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
            const updates = {
                id: user!.id,
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
