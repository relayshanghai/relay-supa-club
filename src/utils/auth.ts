import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserRole } from './api/db/calls/profiles';
import { isAdmin } from './utils';
import { serverLogger } from 'src/utils/logger';
import type { DatabaseWithCustomTypes } from 'types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    serverLogger('NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL not set', 'error');
}

export const serverSideGetUserSessionOrThrow = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>({ req, res });
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session?.user?.email) {
        throw new Error('User not logged in');
    }
    return authData.session;
};

export const checkSessionIdMatchesID = async (
    userId: string,
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    if (!userId) {
        return false;
    }
    try {
        const session = await serverSideGetUserSessionOrThrow(req, res);
        if (session?.user.id === userId) {
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
};

export const isCompanyOwnerOrRelayEmployee = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await serverSideGetUserSessionOrThrow(req, res);
        if (!session?.user.id) return false;
        const { data: profile } = await getUserRole(session?.user.id);
        return isAdmin(profile?.role);
    } catch (error) {
        return false;
    }
};
