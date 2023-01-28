import { createMiddlewareSupabaseClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from 'types/supabase';

/**
 * 
TODO: performance improvement. These two database calls might add too much loading time to each request. Consider adding a cache, or adding something to the session object that shows the user has a company and the company has a payment method.
 */
const checkCompanyIsOnboarded = async (supabase: SupabaseClient<Database>, userId: string) => {
    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .single();
    if (!profile?.company_id) return false;

    // if company hasn't added payment method, redirect to onboarding
    const { data: company } = await supabase
        .from('companies')
        .select('cus_id')
        .eq('id', profile.company_id)
        .single();
    if (!company?.cus_id) return false;
    return true;
};

/** https://supabase.com/docs/guides/auth/auth-helpers/nextjs#auth-with-nextjs-middleware */
export async function middleware(req: NextRequest) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();
    // Create authenticated Supabase Client.
    const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const redirectUrl = req.nextUrl.clone();

    // Check that user is logged in
    if (session?.user?.email) {
        // special case where we require a signed in user to create a company, but we don't want to redirect them to onboarding cause this happens before they are onboarded
        if (req.nextUrl.pathname.includes('api/company/create')) {
            const { user_id } = JSON.parse(await req.text());
            if (!user_id || user_id !== session.user.id) {
                return NextResponse.json({ error: 'user is unauthorized for this action' });
            }
            return res;
        }
        // if signed up, but no company, redirect to onboarding
        const onboarded = await checkCompanyIsOnboarded(supabase, session.user.id);
        if (!onboarded) {
            if (req.nextUrl.pathname.includes('/signup/onboarding')) return res;
            redirectUrl.pathname = '/signup/onboarding';
            return NextResponse.redirect(redirectUrl);
        }
        // if already signed in and has company, redirect to dashboard
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.includes('login')) {
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
        }
        // Authentication successful, forward request to protected route.
        return res;
    }
    // api requests, just return an error
    if (req.nextUrl.pathname.includes('api')) {
        return NextResponse.json({ error: 'unauthorized to use endpoint' });
    }

    // if already on signup or login page, just return the page
    if (req.nextUrl.pathname.includes('signup') || req.nextUrl.pathname.includes('login')) {
        return res;
    }
    // unauthenticated pages requests, send to signup
    redirectUrl.pathname = '/signup';
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    /** https://nextjs.org/docs/advanced-features/middleware#matcher */
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - assets/* (assets files) (public/assets/*)
         * - accept invite (accept invite api). User hasn't logged in yet
         */
        '/((?!_next/static|_next/image|favicon.ico|assets/*|api/company/accept-invite*).*)',
    ],
};
