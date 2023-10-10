import { createMiddlewareSupabaseClient, type Session } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import type { RelayDatabase } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger-server';

const pricingAllowList = ['https://en-relay-club.vercel.app', 'https://relay.club'];

/**
 *
TODO https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/78: performance improvement. These two database calls might add too much loading time to each request. Consider adding a cache, or adding something to the session object that shows the user has a company and the company has a payment method.
 */
const getCompanySubscriptionStatus = async (supabase: RelayDatabase, userId: string) => {
    try {
        const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', userId).single();
        if (!profile?.company_id) return { subscriptionStatus: false, subscriptionEndDate: null };

        const { data: company } = await supabase
            .from('companies')
            .select('subscription_status, subscription_end_date')
            .eq('id', profile.company_id)
            .single();
        return {
            subscriptionStatus: company?.subscription_status,
            subscriptionEndDate: company?.subscription_end_date,
        };
    } catch (error) {
        serverLogger(error);
        return { subscriptionStatus: false, subscriptionEndDate: null };
    }
};

// eslint-disable-next-line complexity
const checkOnboardingStatus = async (
    req: NextRequest,
    res: NextResponse,
    session: Session,
    supabase: RelayDatabase,
) => {
    const redirectUrl = req.nextUrl.clone();
    // special case where we require a signed in user to create a company, but we don't want to redirect them to onboarding cause this happens before they are onboarded
    if (req.nextUrl.pathname === '/api/company/create') {
        const { user_id } = JSON.parse(await req.text());
        if (!user_id || user_id !== session.user.id) {
            return NextResponse.rewrite(redirectUrl.origin, { status: httpCodes.FORBIDDEN });
        }
        return res;
    }

    // special case where we require a signed in user to view their profile, but we don't want to redirect them to onboarding cause this happens before they are onboarded
    if (req.nextUrl.pathname === '/api/profiles' && req.method === 'GET') {
        // print req queries
        const id = new URL(req.url).searchParams.get('id');
        if (!id || id !== session.user.id) {
            return NextResponse.rewrite(redirectUrl.origin, { status: httpCodes.FORBIDDEN });
        }
        return res;
    }
    if (req.nextUrl.pathname === '/api/profiles' && req.method === 'POST') {
        // for new user signup. We have checks in the next endpoint
        return res;
    }
    const { subscriptionStatus } = await getCompanySubscriptionStatus(supabase, session.user.id);
    if (!subscriptionStatus) {
        if (req.nextUrl.pathname.includes('api')) {
            return NextResponse.rewrite(redirectUrl.origin, { status: httpCodes.FORBIDDEN });
        }
        if (req.nextUrl.pathname.includes('signup')) return res;
        //eslint-disable-next-line
        console.error('No subscription_status found, should never happen'); // because either they don't have a session, or they should be awaiting_payment or active etc
    } else if (subscriptionStatus === 'active' || subscriptionStatus === 'trial' || subscriptionStatus === 'canceled') {
        // if already signed in and has company, when navigating to index or login page, redirect to dashboard
        if (
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname === '/login' ||
            req.nextUrl.pathname.includes('/signup')
        ) {
            redirectUrl.pathname = '/boostbot';
            return NextResponse.redirect(redirectUrl);
        }

        // Authentication successful, forward request to protected route.
        return res;
    } else if (subscriptionStatus === 'awaiting_payment_method') {
        // allow the endpoints payment onboarding page requires
        if (
            req.nextUrl.pathname.includes('/api/company') ||
            req.nextUrl.pathname.includes('/api/subscriptions') ||
            req.nextUrl.pathname.includes('/free-trial')
        ) {
            return res;
        }

        redirectUrl.pathname = '/free-trial';
        return NextResponse.redirect(redirectUrl);
    }

    // should never reach here.
    redirectUrl.pathname = '/signup';
    return NextResponse.redirect(redirectUrl);
};

/** Special case: we need to be able to access this from the marketing page, so we need to allow CORS */
const allowPricingCors = (req: NextRequest, res: NextResponse) => {
    const origin = req.headers.get('origin');
    // TODO: once marketing sites are up, refine whitelist. Ticket: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/76
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        res.headers.set('Access-Control-Allow-Origin', '*');
    } else if (origin && pricingAllowList.some((allowed) => origin.includes(allowed)))
        res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET');
    return res;
};

const emailWebhookAllowList = ['email.relay.club'];

const allowEmailWebhookCors = (req: NextRequest, res: NextResponse) => {
    const origin = req.headers.get('origin');
    if (origin && origin.includes('localhost')) {
        res.headers.set('Access-Control-Allow-Origin', '*');
    } else if (origin && emailWebhookAllowList.some((allowed) => origin.includes(allowed))) {
        res.headers.set('Access-Control-Allow-Origin', origin);
    }

    res.headers.set('Access-Control-Allow-Methods', 'POST');
    return res;
};

const checkIsRelayEmployee = async (res: NextResponse, email: string) => {
    if (!EMPLOYEE_EMAILS.includes(email)) {
        return NextResponse.json({ error: 'user is unauthorized for this action' });
    }
    return res;
};
/** https://supabase.com/docs/guides/auth/auth-helpers/nextjs#auth-with-nextjs-middleware
 * Note: We are applying the middleware to all routes. So almost all routes require authentication. Exceptions are in the `config` object at the bottom of this file.
 *
 */
// eslint-disable-next-line complexity
export async function middleware(req: NextRequest) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();

    if (req.nextUrl.pathname === '/api/ping') return res;
    if (req.nextUrl.pathname === '/api/subscriptions/prices') return allowPricingCors(req, res);
    if (req.nextUrl.pathname === '/api/slack/create') return res;
    if (req.nextUrl.pathname === '/api/subscriptions/webhook') return res;
    if (req.nextUrl.pathname === '/api/email-engine/webhook') {
        return allowEmailWebhookCors(req, res);
    }

    // Create authenticated Supabase Client.
    const supabase = createMiddlewareSupabaseClient({ req, res });
    const { data: authData } = await supabase.auth.getSession();
    if (req.nextUrl.pathname.includes('/admin')) {
        if (!authData.session?.user?.email) {
            return NextResponse.rewrite(req.nextUrl.origin, { status: httpCodes.FORBIDDEN });
        }
        return await checkIsRelayEmployee(res, authData.session.user.email);
    }

    if (authData.session?.user?.email) {
        return await checkOnboardingStatus(req, res, authData.session, supabase);
    }

    // not logged in -- api requests, just return an error
    if (req.nextUrl.pathname.includes('api')) {
        return NextResponse.rewrite(req.nextUrl.origin, { status: httpCodes.FORBIDDEN });
    }

    const redirectUrl = req.nextUrl.clone();

    // unauthenticated pages requests, send to signup
    if (req.nextUrl.pathname === '/') return res;
    if (req.nextUrl.pathname === '/signup') return res;
    redirectUrl.pathname = '/';
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
         * - create-employee endpoint (api/company/create-employee)
         * - login, signup, logout (login, signup, logout pages)
         * - Stripe webhook (instead use signing key to protect)
         * - /api/webhooks/* (webhook routes)
         * - free-trial - (free-trial page)
         */
        '/((?!_next/static|_next/image|favicon.ico|assets/*|api/invites/accept*|api/company/create-employee*|login*|login/reset-password|signup/invite*|logout|api/logout|api/subscriptions/webhook|api/webhooks|api/logs/vercel|free-trial).*)',
    ],
};
