import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from 'types/supabase';
/** https://supabase.com/docs/guides/auth/auth-helpers/nextjs#auth-with-nextjs-middleware */
export async function middleware(req: NextRequest) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();
    // Create authenticated Supabase Client.
    const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
    // Check if we have a session
    const { data } = await supabase.auth.getSession();

    const redirectUrl = req.nextUrl.clone();

    // Check auth condition
    if (data?.session?.user?.email?.includes('@')) {
        // this is a special case with onboarding. We want to require a user id for this, but not an activated company account like most other requests require.
        if (req.nextUrl.pathname.includes('api/company/create')) return res;

        // TODO: performance improvement. These two database calls might add too much loading time to each request. Consider adding a cache, or adding something to the session object that shows the user has a company and the company has a payment method.

        // if signed up, but no company, redirect to onboarding
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', data.session.user.id)
            .single();
        if (!profile?.company_id) {
            if (req.nextUrl.pathname.includes('/signup/onboarding')) return res;
            redirectUrl.pathname = '/signup/onboarding';
            return NextResponse.redirect(redirectUrl);
        }
        // if company hasn't added payment method, redirect to onboarding
        const { data: company } = await supabase
            .from('companies')
            .select('cus_id')
            .eq('id', profile.company_id)
            .single();
        if (!company?.cus_id) {
            if (req.nextUrl.pathname.includes('/signup/onboarding')) return res;
            redirectUrl.pathname = '/signup/onboarding';
            return NextResponse;
        }

        // if already signed in and has company, redirect to dashboard
        if (
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.includes('signup') ||
            req.nextUrl.pathname.includes('login')
        ) {
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
        }
        // Authentication successful, forward request to protected route.
        return res;
    }
    if (req.nextUrl.pathname.includes('signup') || req.nextUrl.pathname.includes('login')) {
        return res;
    }
    if (req.nextUrl.pathname.includes('api')) {
        // api requests, just return an error
        return NextResponse.json({ error: 'unauthorized to use endpoint' });
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
         * - accept invite (accept invite api)
         */
        '/((?!_next/static|_next/image|favicon.ico|assets/*|api/company/accept-invite*).*)'
    ]
};
