import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import { serverLogger } from 'src/utils/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    serverLogger('NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL not set', 'error');
}

const handler: NextApiHandler = async (req, res) => {
    const supabaseClient = createServerSupabaseClient({ req, res });
    // Note: this doesn't really do much, because the jwt in the cookie will still be valid. All this `signOut` function does is invalidate the refresh token, so that the jwt can't be refreshed. The jwt will still be valid until it expires.
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: req.query.email as string,
        password: req.query.password as string
    });

    console.log("test login", data)
    console.log("test login", error)

    return res.status(200).json({ success: true, data, error });
};

export default handler;
