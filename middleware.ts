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
        // if already signed in, redirect to dashboard
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

    // Auth condition not met, redirect to signup page.
    redirectUrl.pathname = '/signup';
    // redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
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
         */
        '/((?!_next/static|_next/image|favicon.ico|assets/*).*)'
    ]
};
