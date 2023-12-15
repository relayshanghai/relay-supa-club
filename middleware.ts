/* eslint-disable no-console */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isDev } from 'src/constants';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import { authMiddleware } from '@clerk/nextjs';

const BANNED_USERS: string[] = [];

const pricingAllowList = ['en-relay-club.vercel.app', 'relay.club', 'boostbot.ai'];
const allowPricingCors = (req: NextRequest, res: NextResponse) => {
    const origin = req.headers.get('origin');
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

const trackingAllowList = ['boostbot.ai', 'www.boostbot.ai', 'en.boostbot.ai', 'cn.boostbot.ai'];
const allowTrackingCors = (req: NextRequest, res: NextResponse) => {
    const origin = req.headers.get('origin');
    if (origin && origin.includes('localhost') && isDev()) {
        res.headers.set('Access-Control-Allow-Origin', '*');
    } else if (origin && trackingAllowList.some((allowed) => origin.includes(allowed))) {
        res.headers.set('Access-Control-Allow-Origin', origin);
    }
    res.headers.set('Access-Control-Allow-Methods', 'POST');
    return res;
};

const handleCors = (req: NextRequest, res: NextResponse) => {
    if (req.nextUrl.pathname === '/api/subscriptions/prices') {
        return allowPricingCors(req, res);
    }
    if (req.nextUrl.pathname === '/api/email-engine/webhook') {
        return allowEmailWebhookCors(req, res);
    }
    if (req.nextUrl.pathname === '/api/track' || req.nextUrl.pathname === '/api/track/identify') {
        return allowTrackingCors(req, res);
    }
    return NextResponse.json({ error: 'forbidden' }, { status: httpCodes.FORBIDDEN });
};

const checkIsRelayEmployee = async (res: NextResponse, email: string) => {
    if (!EMPLOYEE_EMAILS.includes(email)) {
        return NextResponse.json({ error: 'user is unauthorized for this action' });
    }
    return NextResponse.next();
};

const redirectToSignIn = (req: NextRequest) => {
    const signInUrl = new URL('/sign-in', req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
};

const needsCorsRoutes = ['/api/subscriptions/prices', '/api/email-engine/webhook', '/api/track', '/api/track/identify'];
const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/logout',
    '/signup/invite',
    '/login/reset-password',
    '/pricing',

    '/api/invites/accept',
    '/api/signup',
    '/api/subscriptions/webhook',
    '/api/webhooks',
    '/api/logs/vercel',
    '/api/brevo/webhook',
    '/api/slack/create',
    '/api/subscriptions/webhook',
    '/api/company/exists',
    '/api/jobs/run',
    '/api/profiles/reset-password',

    ...needsCorsRoutes,
];

export default authMiddleware({
    // debug: true,
    afterAuth: async (auth, req, res: any) => {
        // TODO: see if CORS actually works here. This res type is different than the basic middleware one.
        console.log('>>>>>>>> req.url >>>>>>>>', req.url);

        if (needsCorsRoutes.includes(req.url)) {
            console.log('>>>>>>>> handling cors >>>>>>>>');
            return handleCors(req, res);
        } else if (auth.userId && BANNED_USERS.includes(auth.userId)) {
            console.log('>>>>>>>> banned user >>>>>>>>');
            return redirectToSignIn(req);
        } else if (auth.isPublicRoute || req.nextUrl.pathname.includes('api')) {
            console.log('>>>>>>>> public route >>>>>>>>');
            return NextResponse.next();
        } else if (req.nextUrl.pathname.includes('/admin')) {
            console.log('>>>>>>>> admin route >>>>>>>>');
            if (!auth.user?.emailAddresses[0]?.emailAddress) {
                return NextResponse.rewrite(req.nextUrl.origin, { status: httpCodes.FORBIDDEN });
            }
            return await checkIsRelayEmployee(res, auth.user.emailAddresses[0].emailAddress);
        }
        // Handle users who aren't authenticated
        else if (!auth.userId) {
            console.log('>>>>>>>> not logged in >>>>>>>>');
            // cant use any apis unless you are logged in
            if (req.nextUrl.pathname.includes('api')) {
                return NextResponse.json({ error: 'forbidden' }, { status: httpCodes.FORBIDDEN });
            }
            return redirectToSignIn(req);
        }
        // Redirect logged in users to organization creation if they don't have one (in onboarding)
        else if (auth.userId && !auth.orgId) {
            console.log('>>>>>>>> no org >>>>>>>>');
            if (req.nextUrl.pathname === '/create-org' || req.nextUrl.pathname.includes('api')) {
                // will need to make some api calls during onboarding, so allow those
                return NextResponse.next();
            } else {
                const orgCreation = new URL('/create-org', req.url);
                return NextResponse.redirect(orgCreation);
            }
        }
        // Handle users who are authenticated and have an organization
        else if (auth.userId && auth.orgId) {
            console.log('>>>>>>>> logged in >>>>>>>>');
            return NextResponse.next();
        }

        console.log('>>>>>>>> Should never get here', req.nextUrl.pathname);
        // should never get here
        return redirectToSignIn(req);
    },
    publicRoutes,
});

export const config = {
    /** https://nextjs.org/docs/advanced-features/middleware#matcher */
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         *
         * Static routes
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - assets/* (assets files) (public/assets/*)
         *
         * - api/* (api routes) TODO: remove this once we have a better way to handle api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|assets/*|api/*).*)',
    ],
};
