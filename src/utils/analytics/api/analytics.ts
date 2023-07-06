import { getCookie } from 'cookies-next';
import { ANALYTICS_COOKIE_ANON } from '../constants';
import type { ctx } from '../types';

export const getAnonId = (ctx: ctx) => {
    let cookie = getCookie(ANALYTICS_COOKIE_ANON, ctx);

    if (typeof cookie !== 'string') {
        cookie = String(cookie);
    }

    return cookie;
};
