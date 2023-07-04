import type { NextApiRequest, NextApiResponse } from 'next';
import { JOURNEY_COOKIE_NAME } from './constants';
import { getCookie } from 'cookies-next';

/**
 * a Server Context contains a request and response
 */
type ctx = { req: NextApiRequest; res: NextApiResponse };

/**
 * Get the current journey (if available) on the server side
 *
 * @param  {ctx}  [ctx] Server context
 */
export const getJourney = (ctx: ctx) => {
    let cookie = getCookie(JOURNEY_COOKIE_NAME, ctx);

    if (typeof cookie !== 'string') {
        cookie = String(cookie);
    }

    const [id, name, status, created_at, updated_at, tag] = cookie.split('|');

    if (!updated_at) {
        return null;
    }

    return { id, name, status, created_at, updated_at, tag };
};
