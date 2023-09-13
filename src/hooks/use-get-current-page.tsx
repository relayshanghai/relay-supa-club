import { useRouter } from 'next/router';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import { clientLogger } from 'src/utils/logger-client';

export const useGetCurrentPage = () => {
    const { pathname } = useRouter();

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

    if (/^\/$/.test(pathname)) {
        return CurrentPageEvent.index;
    }

    clientLogger(`Cannot get current page: ${pathname}`, 'error', true);
};
