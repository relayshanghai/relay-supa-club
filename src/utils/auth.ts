import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserRole } from './api/db/calls/profiles';
import { isAdmin } from './utils';
import { GetServerSidePropsContext } from 'next';
import { serverLogger } from 'src/utils/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    serverLogger('NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL not set', 'error');
}

export const checkSessionIdMatchesID = async (
    userId: string,
    req: NextApiRequest,
    res: NextApiResponse,
) => {
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

    return isAdmin(profile?.role);
};

export const logoutRedirect = async (ctx: GetServerSidePropsContext, email?: string) => {
    const supabaseClient = createServerSupabaseClient(ctx, {
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
    });

    // Note: this doesn't really do much, because the jwt in the cookie will still be valid. All this `signOut` function does is invalidate the refresh token, so that the jwt can't be refreshed. The jwt will still be valid until it expires.
    await supabaseClient.auth.signOut();

    // The cookie should already be deleted by the browser, but just in case, we'll delete it here as well.
    ctx.res.setHeader('Set-Cookie', ['supabase-auth-token=deleted; Max-Age=0; value=deleted']);

    return {
        redirect: {
            destination: `/login${email ? `?email=${email}` : ''}`,
            permanent: false,
        },
    };
};
