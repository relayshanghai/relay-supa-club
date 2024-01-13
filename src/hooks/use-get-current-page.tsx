import { useRouter } from 'next/router';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import { clientLogger } from 'src/utils/logger-client';

export const useGetCurrentPage = () => {
    const { pathname, isReady } = useRouter();
    if (!pathname || !isReady) {
        return CurrentPageEvent.null;
    }

    if (/^\/boostbot\/?/.test(pathname)) {
        return CurrentPageEvent.boostbot;
    }

    if (/^\/dashboard\/?/.test(pathname)) {
        return CurrentPageEvent.dashboard;
    }

    if (/^\/sequences\/?/.test(pathname)) {
        return CurrentPageEvent.sequences;
    }

    if (/^\/inbox\/?/.test(pathname)) {
        return CurrentPageEvent.inbox;
    }

    if (/^\/influencer-manager\/?/.test(pathname)) {
        return CurrentPageEvent['influencer-manager'];
    }

    if (/^\/guide\/?/.test(pathname)) {
        return CurrentPageEvent.guide;
    }

    if (/^\/account\/?/.test(pathname)) {
        return CurrentPageEvent.account;
    }

    if (/^\/pricing\/?/.test(pathname)) {
        return CurrentPageEvent.pricing;
    }

    if (/^\/upgrade\/?/.test(pathname)) {
        return CurrentPageEvent.upgrade;
    }

    if (/^\/login\/?/.test(pathname)) {
        return CurrentPageEvent.login;
    }

    if (/^\/signup\/?/.test(pathname)) {
        return CurrentPageEvent.signup;
    }

    if (/^\/payments\/?/.test(pathname)) {
        return CurrentPageEvent.payments;
    }

    if (/^\/influencer\/?/.test(pathname)) {
        return CurrentPageEvent.influencer;
    }

    if (/^\/campaigns\/?/.test(pathname)) {
        return CurrentPageEvent.campaigns;
    }

    if (/^\/admin\/?/.test(pathname)) {
        return CurrentPageEvent.admin;
    }

    if (/^\/performance\/?/.test(pathname)) {
        return CurrentPageEvent.performance;
    }

    if (/^\/$/.test(pathname)) {
        return CurrentPageEvent.index;
    }
    if (/^\/_error\/?/.test(pathname)) {
        return CurrentPageEvent.error;
    }
    if (/^\/component-preview\/?/.test(pathname)) {
        return CurrentPageEvent.preview;
    }
    if (/^\/logout\/?/.test(pathname)) {
        return CurrentPageEvent.logout;
    }

    clientLogger(`Cannot get current page: ${pathname}`, 'error', true);
};
