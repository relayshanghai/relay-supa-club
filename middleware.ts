import {
    createMiddlewareSupabaseClient,
    Session,
    SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DatabaseWithCustomTypes } from 'types';
import { serverLogger } from 'src/utils/logger';

const pricingAllowList = ['https://en-relay-club.vercel.app', 'https://relay.club'];
const stripeWebhookAllowlist = ['https://stripe.com/', 'https://hooks.stripe.com/'];

/**
 * 
TODO https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/78: performance improvement. These two database calls might add too much loading time to each request. Consider adding a cache, or adding something to the session object that shows the user has a company and the company has a payment method.
 */
const getCompanySubscriptionStatus = async (
    supabase: SupabaseClient<DatabaseWithCustomTypes>,
    userId: string,
) => {
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', userId)
            .single();
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
        serverLogger(error, 'error');
        return { subscriptionStatus: false, subscriptionEndDate: null };
    }
};

const checkOnboardingStatus = async (
    req: NextRequest,
    res: NextResponse,
    session: Session,
    supabase: SupabaseClient<DatabaseWithCustomTypes>,
) => {
    const redirectUrl = req.nextUrl.clone();

    // special case where we require a signed in user to create a company, but we don't want to redirect them to onboarding cause this happens before they are onboarded
    if (req.nextUrl.pathname === '/api/company/create') {
        const { user_id } = JSON.parse(await req.text());
        if (!user_id || user_id !== session.user.id) {
            return NextResponse.json({ error: 'user is unauthorized for this action' });
        }
        return res;
    }
    const { subscriptionStatus, subscriptionEndDate } = await getCompanySubscriptionStatus(
        supabase,
        session.user.id,
    );
    // if signed up, but no company, redirect to onboarding
    if (!subscriptionStatus) {
        if (req.nextUrl.pathname === '/signup/onboarding') return res;
        redirectUrl.pathname = '/signup/onboarding';
        return NextResponse.redirect(redirectUrl);
    }
    if (subscriptionStatus === 'active' || subscriptionStatus === 'trial') {
        // if already signed in and has company, when navigating to index or login page, redirect to dashboard
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/login') {
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
        }

        // Authentication successful, forward request to protected route.
        return res;
    }
    if (subscriptionStatus === 'canceled') {
        // if subscription ended only allow access to account page, and subscription endpoints
        const allowedPaths = [
            '/signup',
            '/login',
            '/account',
            '/api/subscriptions',
            '/api/subscriptions/payment-method',
            '/api/subscriptions/portal',
            '/api/subscriptions/create',
            '/api/company',
            '/pricing',
        ];
        if (allowedPaths.some((path) => req.nextUrl.pathname === path)) return res;
        else {
            if (!subscriptionEndDate) {
                redirectUrl.pathname = '/account';
                return NextResponse.redirect(redirectUrl);
            }

            const endDate = new Date(subscriptionEndDate);
            if (endDate < new Date()) {
                redirectUrl.pathname = '/account';
                return NextResponse.redirect(redirectUrl);
            } else return res;
        }
    }

    // if company registered, but no payment method, redirect to payment onboarding
    if (subscriptionStatus === 'awaiting_payment_method') {
        // allow the endpoints payment onboarding page requires
        if (
            req.nextUrl.pathname.includes('/api/company') ||
            req.nextUrl.pathname.includes('/api/subscriptions')
        )
            return res;

        if (req.nextUrl.pathname.includes('/signup/payment-onboard')) return res;
        redirectUrl.pathname = '/signup/payment-onboard';
        return NextResponse.redirect(redirectUrl);
    }
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
const allowStripeCors = (req: NextRequest, res: NextResponse) => {
    const origin = req.headers.get('origin');
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        res.headers.set('Access-Control-Allow-Origin', '*');
    } else if (origin && stripeWebhookAllowlist.some((allowed) => origin.includes(allowed)))
        res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET');
    return res;
};

/** https://supabase.com/docs/guides/auth/auth-helpers/nextjs#auth-with-nextjs-middleware */
export async function middleware(req: NextRequest) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();

    if (req.nextUrl.pathname === '/api/subscriptions/prices') return allowPricingCors(req, res);
    if (req.nextUrl.pathname === '/api/subscriptions/webhook') return allowStripeCors(req, res);

    // Create authenticated Supabase Client.
    const supabase = createMiddlewareSupabaseClient<DatabaseWithCustomTypes>({ req, res });
    const { data: authData } = await supabase.auth.getSession();
    if (authData.session?.user?.email)
        return await checkOnboardingStatus(req, res, authData.session, supabase);

    // not logged in -- api requests, just return an error
    if (req.nextUrl.pathname.includes('api'))
        return NextResponse.json({ error: 'unauthorized to use endpoint' });

    // if already on signup or login page, just return the page
    if (req.nextUrl.pathname.includes('signup') || req.nextUrl.pathname.includes('login'))
        return res;

    const redirectUrl = req.nextUrl.clone();

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
