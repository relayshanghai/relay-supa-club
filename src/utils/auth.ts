import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserRole } from './api/db/calls/profiles-no-client';
import { isAdmin } from './utils';
import { serverLogger } from 'src/utils/logger-server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    serverLogger('NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL not set');
}

export const checkSessionIdMatchesID = async (userId: string, req: NextApiRequest, res: NextApiResponse) => {
    if (!userId) return false;
    const supabase = createServerSupabaseClient(
        { req, res },
        {
            supabaseUrl,
            supabaseKey: supabaseAnonKey,
        },
    );
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (session?.user.id !== userId) return false;
    return true;
};

export const isCompanyOwnerOrRelayEmployee = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient(
        { req, res },
        {
            supabaseUrl,
            supabaseKey: supabaseAnonKey,
        },
    );
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user.id) return false;
    const { data: profile } = await getUserRole(session?.user.id);

    return isAdmin(profile?.user_role);
};

export const getSession = (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient(
        { req, res },
        {
            supabaseUrl,
            supabaseKey: supabaseAnonKey,
        },
    );
    return supabase.auth.getSession();
};
