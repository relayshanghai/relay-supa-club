import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
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

export const isCompanyOwnerOrRelayEmployee = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res });
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user.id) return false;
    const { data: profile } = await getUserRole(session?.user.id);
    const isAdmin =
        profile?.role === 'company_owner' ||
        profile?.role === 'relay_employee' ||
        profile?.role === 'relay_expert';
    return isAdmin;
};
