import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { serverLogger } from 'src/utils/logger-server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    serverLogger('NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL not set');
}

const handler: NextApiHandler = async (req, res) => {
    const supabaseClient = createServerSupabaseClient(
        { req, res },
        {
            supabaseUrl,
            supabaseKey: supabaseAnonKey,
        },
    );
    // Note: this doesn't really do much, because the jwt in the cookie will still be valid. All this `signOut` function does is invalidate the refresh token, so that the jwt can't be refreshed. The jwt will still be valid until it expires.
    await supabaseClient.auth.signOut();

    const cookieExpiry = new Date();

    // The cookie should already be deleted by the browser, but just in case, we'll delete it here as well.
    res.setHeader('Set-Cookie', `supabase-auth-token=deleted; Max-Age=0; Expires=${cookieExpiry.toUTCString()};`);
    return res.status(200).json({ success: true });
};

export default handler;
