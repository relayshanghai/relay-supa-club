import { JOURNEY_COOKIE_NAME } from '../constants';
import { getCookie } from 'cookies-next';
import { parseJson } from 'src/utils/json';
import { JourneyObject } from '../types';
import type { ServerContext } from '../types';

/**
 * Get the current journey (if available) on the server side
 *
 * @param  {ServerContext}  [ctx] Server context
 */
export const getJourney = (ctx: ServerContext) => {
    let cookie = getCookie(JOURNEY_COOKIE_NAME, ctx);

    if (typeof cookie !== 'string') {
        cookie = String(cookie);
    }

    const journey = parseJson<JourneyObject>(cookie);

    if (journey === false) {
        return null;
    }

    const result = JourneyObject.safeParse(journey);

    if (result.success === false) {
        return null;
    }

    return result.data;
};
