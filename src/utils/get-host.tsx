import type { NextApiRequest } from 'next';
import { useEffect, useState } from 'react';
import { BOOSTBOT_DOMAIN, isDev } from 'src/constants';

export const getHostnameFromRequest = (
    req: NextApiRequest,
): {
    /** app.boostbot.ai */
    hostname: string;
    /** https://app.boostbot.ai */
    appUrl: string;
} => {
    const hostname = req.headers.host;
    if (!hostname) {
        throw new Error('No host provided');
    }
    const appUrl = isDev() ? `http://${hostname}` : `https://${hostname}`;
    return { hostname, appUrl };
};

export const useHostname = (): {
    /** app.boostbot.ai */
    hostname: string;
    /** https://app.boostbot.ai */
    appUrl: string;
} => {
    const [hostname, setHostname] = useState(isDev() ? 'localhost:3000' : `app.${BOOSTBOT_DOMAIN}`);
    const [appUrl, setAppUrl] = useState(isDev() ? 'http://localhost:3000' : `https://app.${BOOSTBOT_DOMAIN}`);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        setHostname(window.location.host);
        setAppUrl(window.location.origin);
    }, []);

    return { hostname, appUrl };
};
