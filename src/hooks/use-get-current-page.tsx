import { useRouter } from 'next/router';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import { clientLogger } from 'src/utils/logger-client';

export const useGetCurrentPage = () => {
    const { pathname } = useRouter()

    if (pathname.match(/^\/boostbot\/?/)) {
        return CurrentPageEvent.boostbot
    }

    if (pathname.match(/^\/dashboard\/?/)) {
        return CurrentPageEvent.dashboard
    }

    if (pathname.match(/^\/sequences\/?/)) {
        return CurrentPageEvent.sequences
    }

    if (pathname.match(/^\/inbox\/?/)) {
        return CurrentPageEvent.inbox
    }

    if (pathname.match(/^\/influencer-manager\/?/)) {
        return CurrentPageEvent['influencer-manager']
    }

    if (pathname.match(/^\/guide\/?/)) {
        return CurrentPageEvent.guide
    }

    if (pathname.match(/^\/account\/?/)) {
        return CurrentPageEvent.account
    }

    if (pathname.match(/^\/pricing\/?/)) {
        return CurrentPageEvent.pricing
    }

    if (pathname.match(/^\/login\/?/)) {
        return CurrentPageEvent.login
    }

    if (pathname.match(/^\/signup\/?/)) {
        return CurrentPageEvent.signup
    }

    if (pathname.match(/^\/influencer\/?/)) {
        return CurrentPageEvent.influencer
    }

    if (pathname.match(/^\/admin\/?/)) {
        return CurrentPageEvent.admin
    }

    if (pathname.match(/^\/$/)) {
        return CurrentPageEvent.index
    }

    clientLogger(`Cannot get current page: ${pathname}`, 'error', true);
}
