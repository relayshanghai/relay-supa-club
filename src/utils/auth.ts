import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { AccountRole } from 'types';
import { getUserRole } from './api/db';

export const checkSessionIdMatchesID = async (
    userId: string,
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    if (!userId) return false;
    const supabase = createServerSupabaseClient({ req, res });
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (session?.user.id !== userId) return false;
    return true;
};

export const isAdmin = (role?: AccountRole) => {
    if (!role) {
        return false;
    }
    const isAdmin =
        role === 'company_owner' || role === 'relay_employee' || role === 'relay_expert';
    return isAdmin;
};

export const isCompanyOwnerOrRelayEmployee = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res });
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user.id) return false;
    const { data: profile } = await getUserRole(session?.user.id);

    return isAdmin(profile?.role);
};
